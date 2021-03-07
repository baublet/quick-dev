import { environment as envEntity } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetReadyArguments } from ".";
import { canSetStopping } from "./canSetStopping";

export async function setStopping({
  trx,
  environment,
}: SetReadyArguments): Promise<StateMachineReturnValue> {
  log.debug("setStarted: Setting environment to status: started", {
    environment: environment.name,
  });

  const canContinue = await canSetStopping({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  // Tell our environment provider to shut it down and record the action

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "stopping",
  });

  log.debug(
    "setFinishedProvisioning: Updated environment to finished provisioning",
    {
      environment: environment.subdomain,
    }
  );

  return {
    operationSuccess: true,
    errors: [],
  };
}
