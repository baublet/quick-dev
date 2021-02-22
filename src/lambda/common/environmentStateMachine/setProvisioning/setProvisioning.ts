import { environment as envEntity } from "../../entities";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";

// Called by a box when it's up and starts running our provisioning scripts
export async function setProvisioning({
  environment,
  trx,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  // Update the environment in the database
  try {
    await trx.transaction(async (trx) => {
      await enqueueJob("getEnvironmentStartupLogs", {
        environmentId: environment.id,
      });
      await envEntity.update(trx, environment.id, {
        lifecycleStatus: "provisioning",
      });
      await envEntity.resetProcessorByEnvironmentId(trx, environment.id);
    });
  } catch (e) {
    log.error("Unknown error setting environment to provisioning", {
      message: e.message,
      stack: e.stack,
    });
    return {
      operationSuccess: false,
      errors: [e.message, e.stack],
    };
  }

  log.debug("Updated environment to provisioning", {
    environment: environment.name,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
