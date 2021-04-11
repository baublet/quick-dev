import { environment as envEntity, environmentCommand } from "../../entities";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";
import { canSetErrorProvisioning } from "./canSetErrorProvisioning";
import { environmentCommandStateMachine } from "../../environmentCommandStateMachine";

// Called by a box when it's up and starts running our provisioning scripts
export async function setErrorProvisioning({
  environment,
  trx,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  log.debug(
    "setErrorProvisioning: Setting environment to status: error provisioning",
    {
      environment: environment.subdomain,
    }
  );
  const canContinue = await canSetErrorProvisioning({ trx, environment });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  // Update the environment in the database
  await enqueueJob(
    "deleteEnvironmentInProvider",
    { environmentId: environment.id },
    { startAfter: 1000 * 60 * 60 * 2 }
  );
  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "error_provisioning",
  });

  const commands = await environmentCommand.getByEnvironmentId(
    trx,
    environment.id
  );
  await Promise.all(
    commands.map((command) =>
      environmentCommandStateMachine.setCancelled({
        trx,
        environment,
        environmentCommand: command,
      })
    )
  );

  log.debug("setErrorProvisioning: Updated environment to error provisioning", {
    environment: environment.subdomain,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
