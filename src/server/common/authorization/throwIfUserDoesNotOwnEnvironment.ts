import { Environment } from "../entities";
import { ContextUser } from "../context";
import { log } from "../../../common/logger";

export function throwIfUserDoesNotOwnEnvironment(
  user: ContextUser | null,
  environment: Environment
) {
  if (!user) {
    throw new Error("You must be logged in to perform this action");
  }

  if (user.user.id !== environment.userId) {
    return;
  }

  log.error("User tried to access invalid resource", { user, environment });
  throw new Error("Environment not found");
}
