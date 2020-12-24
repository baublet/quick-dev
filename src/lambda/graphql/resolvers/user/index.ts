import { Context } from "../../contextFactory";

export function user(_parent: unknown, args: unknown, context: Context) {
  return context.user;
}
