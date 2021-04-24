import { ulid } from "ulid";

import { createHumanReadableId } from "../../createHumanReadableId";
import { canSetNew, SetNewArguments } from ".";
import { StateMachineReturnValue } from "../";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";
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

  const user = context.user;
  if (user === null) {
    throw new Error(`You must be logged in to create new environments`);
  }

  return context.db.transaction(async (trx) => {
    let sshKeyId: string;
    try {
      const providerKey = await getExternalEnvironmentHandler({
        source: "digital_ocean",
      }).getOrCreateSSHKey(trx, context, {
        userId: user.user.id,
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

    const subdomain = createHumanReadableId();
    const environment = await envEntity.create(trx, {
      image: environmentStrapYardFile.image,
      name: subdomain,
      repositoryUrl: input.repositoryUrl,
      secret: ulid(),
      sshKeyId,
      strapYardFile: environmentStrapYardFile.rawFile,
      subdomain,
      userId: user.user.id,
    });
    await enqueueJob("createEnvironmentCommands", {
      environmentId: environment.id,
    });

    return {
      operationSuccess: true,
      errors: [],
      environment: environment,
    };
  });
}
