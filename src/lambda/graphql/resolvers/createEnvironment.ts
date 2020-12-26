import { hri } from "human-readable-ids";

import { Context } from "../../common/context";
import { create, Environment } from "../../common/environment";

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
    const subdomain = hri.random();
    return create(trx, {
      name: subdomain,
      repositoryUrl,
      subdomain,
      user: context.user.email,
      userSource: context.user.source,
    });
  });

  return {
    errors: [],
    environment: created,
  };
}
