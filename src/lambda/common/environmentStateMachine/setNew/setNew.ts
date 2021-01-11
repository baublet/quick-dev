import { hri } from "human-readable-ids";
import { ulid } from "ulid";

import { canSetNew, SetNewArguments } from ".";
import { StateMachineReturnValue } from "../";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { getOrCreateSSHKey } from "../../externalEnvironmentHandler/digitalOcean/getOrCreateSSHKey";
import { getRepoStrapYardFile } from "../../gitHub";
import { environment as envEntity } from "../../entities";

export async function setNew({
  context,
  input,
}: SetNewArguments): Promise<StateMachineReturnValue> {
  const canContinue = await canSetNew({ context, input });
  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  return context.db.transaction(async (trx) => {
    let sshKeyId: string;
    try {
      const providerKey = await getOrCreateSSHKey(trx, context, {
        user: context.user.email,
        userSource: context.user.source,
      });
      sshKeyId = providerKey.sshKeyId;
    } catch (e) {
      log.error("Error creating environment: ", { error: e });
      throw e;
    }

    const environmentStrapYardFile = await getRepoStrapYardFile(
      context,
      input.repositoryUrl
    );

    if (typeof environmentStrapYardFile === "string") {
      return {
        errors: [environmentStrapYardFile],
        operationSuccess: false,
      };
    }

    const subdomain = hri.random();
    const environment = await envEntity.create(trx, {
      name: subdomain,
      repositoryUrl: input.repositoryUrl,
      secret: ulid(),
      sshKeyId,
      strapYardFile: environmentStrapYardFile.rawFile,
      subdomain,
      user: context.user.email,
      userSource: context.user.source,
    });
    await enqueueJob(trx, "createEnvironmentCommands", {
      environmentId: environment.id,
    });

    return {
      operationSuccess: true,
      errors: [],
      environment: environment,
    };
  });
}
