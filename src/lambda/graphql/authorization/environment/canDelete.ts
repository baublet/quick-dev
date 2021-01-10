import { Context } from "../../../common/context";
import { Environment } from "../../../common/entities";

export async function canDelete(context: Context, environment: Environment) {
  const userSource = context.user.source;
  const user = context.user.email;

  if (environment.user !== user) return false;
  if (environment.userSource !== userSource) return false;
  return true;
}
