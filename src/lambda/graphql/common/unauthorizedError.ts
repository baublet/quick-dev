import { log } from "../../../common/logger";
import { Context } from "../../common/context";

export function unauthorizedError(context: Context) {
  log.debug("User unauthorized", {
    context,
  });
  throw new Error(`Unauthorized`);
}
