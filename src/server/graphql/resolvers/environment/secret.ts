import { Context } from "../../../common/context";
import { Environment } from "../../../common/entities";

export async function environmentSecret(
  parent: Environment,
  args: unknown,
  context: Context
): Promise<string | undefined> {
  if (parent.userSource !== context.user?.source) {
    return undefined;
  }
  if (parent.user !== context.user.email) {
    return undefined;
  }
  if (parent.lifecycleStatus !== "ready") {
    return undefined;
  }
  return parent.secret;
}
