import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";

// Called by a box when it's up and starts running our provisioning scripts
export async function canSetProvisioning({
  environment,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    log.error(
      `EnvironmentReadyToProvision request received for environment that's not in the proper status`,
      { environment }
    );
    return {
      operationSuccess: false,
      errors: [
        "EnvironmentReadyToProvision request received for environment that's not in the proper status",
      ],
    };
  }
  return {
    operationSuccess: true,
    errors: [],
  };
}
