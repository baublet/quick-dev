import { Context } from "../../../common/context";

export function user(_parent: unknown, args: unknown, context: Context) {
  return context.user;
}
