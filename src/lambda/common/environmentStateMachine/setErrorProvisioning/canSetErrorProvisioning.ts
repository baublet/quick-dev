import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";
import { environmentCommand } from "../../entities";
import { hasCommandInStatus } from "../../hasCommandInStatus";

// Called by a box when it's up and starts running our provisioning scripts
export async function canSetErrorProvisioning({
  trx,
  environment,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "provisioning") {
    log.error(
      `EnvironmentReadyToProvision request received for environment that's not in the proper status. Expected "provisioning", but got ${environment.lifecycleStatus}`,
      {
        environment: environment.subdomain,
        status: environment.lifecycleStatus,
      }
    );
    return {
      operationSuccess: false,
      errors: [
        `EnvironmentReadyToProvision request received for environment that's not in the proper status`,
      ],
    };
  }

  const commands = await environmentCommand.getByEnvironmentId(
    trx,
    environment.id
  );

  if (hasCommandInStatus(commands, "waiting")) {
    log.debug(
      "Environment has a command waiting, can't set error provisioning"
    );
    return {
      operationSuccess: false,
      errors: [],
    };
  }

  if (hasCommandInStatus(commands, "running")) {
    log.debug(
      "Environment has a command running, can't set error provisioning"
    );
    return {
      operationSuccess: false,
      errors: [],
    };
  }

  return {
    operationSuccess: true,
    errors: [],
  };
}
