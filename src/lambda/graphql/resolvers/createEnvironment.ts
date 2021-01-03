import { hri } from "human-readable-ids";
import { ulid } from "ulid";
import { log } from "../../../common/logger";

import { Context } from "../../common/context";
import { create, Environment } from "../../common/environment";
import { getOrCreateSSHKey } from "../../common/environmentHandler/digitalOcean/getOrCreateSSHKey";

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
  const created = await context.db.transaction(async (trx) => {
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

    const subdomain = hri.random();
    const environment = await create(trx, {
      name: subdomain,
      repositoryUrl,
      subdomain,
      user: context.user.email,
      userSource: context.user.source,
      secret: ulid(),
      sshKeyId,
    });

    return environment;
  });

  return {
    errors: [],
    environment: created,
  };
}
