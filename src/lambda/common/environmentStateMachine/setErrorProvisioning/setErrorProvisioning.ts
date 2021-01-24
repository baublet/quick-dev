import { environment as envEntity } from "../../entities";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";
import { canSetErrorProvisioning } from "./canSetErrorProvisioning";

// Called by a box when it's up and starts running our provisioning scripts
export async function setErrorProvisioning({
  environment,
  trx,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  log.debug(
    "setErrorProvisioning: Setting environment to status: error provisioning",
    {
      environment: environment.name,
    }
  );
  const canContinue = await canSetErrorProvisioning({ trx, environment });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  // Update the environment in the database
  await enqueueJob(trx, "deleteEnvironmentInProvider", {
    environmentId: environment.id,
  });
  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "error_provisioning",
  });

  log.debug("setErrorProvisioning: Updated environment to error provisioning", {
    environment: environment.subdomain,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
