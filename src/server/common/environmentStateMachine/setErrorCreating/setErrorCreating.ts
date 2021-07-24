import { environment as envEntity, environmentCommand } from "../../entities";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { StateMachineReturnValue } from "..";
import { SetErrorCreatingArguments } from ".";
import { canSetErrorCreating } from "./canSetErrorCreating";
import { environmentCommandStateMachine } from "../../environmentCommandStateMachine";

// Called by a box when it's up and starts running our provisioning scripts
export async function setErrorCreating({
  environment,
  trx,
}: SetErrorCreatingArguments): Promise<StateMachineReturnValue> {
  log.debug(
    "canSetErrorCreating: Setting environment to status: error provisioning",
    {
      environment: environment.subdomain,
    }
  );
  const canContinue = await canSetErrorCreating({ trx, environment });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  // Update the environment in the database
  await enqueueJob("deleteEnvironmentInProvider", {
    environmentId: environment.id,
  });
  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "error_creating",
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
