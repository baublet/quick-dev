import dayjs from "dayjs";

import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";

// Called by a box when it's up and starts running our provisioning scripts
export async function canSetProvisioning({
  environment,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  const errors: string[] = [];

  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    errors.push(
      "EnvironmentReadyToProvision request received for environment that's not in the proper status"
    );
  }

  if (!environment.sourceId) {
    errors.push(
      "Can't set an environment to provisioning if it doesn't have a source ID!"
    );
  }

  const environmentInProvider = await getExternalEnvironmentHandler(
    environment
  ).getEnvironment(environment);

  if (environmentInProvider.status !== "active") {
    errors.push("Environment in provider is not active");
  }

  if (!environmentInProvider.ipv4) {
    errors.push("Environment in provider has no IP");
  }

  if (
    // We need to wait around 2 minutes before we can actually start running
    // commands before any environment locks are freed in the source from the
    // initial provisioning.
    dayjs(environmentInProvider.created_at)
      .add(2, "minutes")
      .isAfter(Date.now())
  ) {
    errors.push(
      "Time between environment creation and provisioning not yet met. Need to wait longer as a safety debounce"
    );
  }

  if (errors.length > 0) {
    log.debug(
      "Environment not allowed to set provisioning because the environment in the provider is not ready yet",
      {
        errors,
        environmentInProvider,
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
