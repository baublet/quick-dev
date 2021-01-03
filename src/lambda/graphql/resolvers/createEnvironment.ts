import { hri } from "human-readable-ids";
import { ulid } from "ulid";

import { log } from "../../../common/logger";
import { Context } from "../../common/context";
import { enqueueJob } from "../../common/enqueueJob";
import { create, Environment } from "../../common/environment";
import { getOrCreateSSHKey } from "../../common/environmentHandler/digitalOcean/getOrCreateSSHKey";
import { getRepoStrapYardFile } from "../../common/gitHub";

interface CreateEnvironmentArguments {
  input: {
    repositoryUrl: string;
  };
}

export async function createEnvironment(
  _parent: unknown,
  { input: { repositoryUrl } }: CreateEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  return context.db.transaction(async (trx) => {
    let sshKeyId: number;
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
      repositoryUrl
    );

    if (typeof environmentStrapYardFile === "string") {
      return {
        errors: [environmentStrapYardFile],
      };
    }

    const subdomain = hri.random();
    const environment = await create(trx, {
      name: subdomain,
      repositoryUrl,
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
      environment,
      errors: [],
    };
  });
}
