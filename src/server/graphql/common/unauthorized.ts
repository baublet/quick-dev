import { Context, ContextWithUser } from "../../common/context";

export function unauthorized(context: Context): context is ContextWithUser {
  const user = context.user;
  if (user) {
    return true;
  }
  return false;
}
