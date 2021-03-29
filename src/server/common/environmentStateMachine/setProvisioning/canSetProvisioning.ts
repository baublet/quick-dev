import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";

// Called by a box when it's up and starts running our provisioning scripts
export async function canSetProvisioning({
  environment,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    log.error(
      `EnvironmentReadyToProvision request received for environment that's not in the proper status`,
      { environment: environment.subdomain }
    );
    return {
      operationSuccess: false,
      errors: [
        "EnvironmentReadyToProvision request received for environment that's not in the proper status",
      ],
    };
  }

  if (!environment.sourceId) {
    log.error(
      "Environment trying to set provisioning without having created the environment in the external provider!",
      {
        environment: environment.subdomain,
      }
    );
    return {
      operationSuccess: false,
      errors: [
        "Can't set an environment to provisioning if it doesn't have a source ID!",
      ],
    };
  }

  const environmentInProvider = await DigitalOceanHandler.getEnvironment(
    environment
  );
  if (
    environmentInProvider.status !== "active" ||
    !environmentInProvider.ipv4
  ) {
    log.warn(
      "Environment not allowed to set active because the environment in the provider is not ready yet",
      {
        environmentInProvider,
      }
    );
    return {
      operationSuccess: false,
      errors: [
        "Can't set an environment to provisioning if the external environment isn't yet active",
      ],
    };
  }

  return {
    operationSuccess: true,
    errors: [],
  };
}
