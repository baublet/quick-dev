import { Context } from "../../../common/context";
import { Environment } from "../../../common/entities";

export async function environmentSecret(
  environment: Environment,
  args: unknown,
  context: Context
): Promise<string | undefined> {
  const userRecord = context.getUserOrFail().user;
  if (environment.userId !== userRecord.id) {
    return undefined;
  }
  if (environment.lifecycleStatus !== "ready") {
    return undefined;
  }
  return environment.secret;
}
