import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetCleaningUpArguments } from ".";

// Called by a box when it's up and starts running our provisioning scripts
export async function canSetCleaningUp({
  environment,
}: SetCleaningUpArguments): Promise<StateMachineReturnValue> {
  const errors: string[] = [];

  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "ready") {
    errors.push(
      "EnvironmentReadyToProvision request received for environment that's not in the proper status"
    );
  }

  if (!environment.sourceId) {
    errors.push(
      "Can't set an environment to provisioning if it doesn't have a source ID!"
    );
  }

  if (errors.length > 0) {
    log.debug(
      "Environment not allowed to set provisioning because the environment in the provider is not ready yet",
      {
        errors,
      }
    );
    return {
      operationSuccess: false,
      errors,
    };
  }

  return {
    operationSuccess: true,
    errors: [],
  };
}
