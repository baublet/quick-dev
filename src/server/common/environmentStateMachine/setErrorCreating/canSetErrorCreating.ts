import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetErrorCreatingArguments } from ".";
import { environmentCommand } from "../../entities";
import { hasCommandInStatus } from "../../hasCommandInStatus";

// Called by a box when it's up and starts running our provisioning scripts
export async function canSetErrorCreating({
  trx,
  environment,
}: SetErrorCreatingArguments): Promise<StateMachineReturnValue> {
  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    log.error(
      `setErrorCreating request received for environment that's not in the proper status. Expected "creating", but got ${environment.lifecycleStatus}`,
      {
        environment: environment.subdomain,
        status: environment.lifecycleStatus,
      }
    );
    return {
      operationSuccess: false,
      errors: [
        `setErrorCreating request received for environment that's not in the proper status`,
      ],
    };
  }

  const commands = await environmentCommand.getByEnvironmentId(
    trx,
    environment.id
  );

  if (hasCommandInStatus(commands, "running")) {
    log.debug(
      "setErrorCreating: Environment has a command running, can't set error creating"
    );
    return {
      operationSuccess: false,
      errors: [
        "setErrorCreating: Environment has a command running, can't set error creating",
      ],
    };
  }

  return {
    operationSuccess: true,
    errors: [],
  };
}
