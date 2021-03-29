import { environment as envEntity } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetFinishedProvisioningArguments } from ".";
import { canSetFinishedProvisioning } from "./canSetFinishedProvisioning";

export async function setFinishedProvisioning({
  trx,
  environment,
  environmentCommands,
}: SetFinishedProvisioningArguments): Promise<StateMachineReturnValue> {
  log.debug(
    "setFinishedProvisioning: Setting environment to status: error provisioning",
    {
      environment: environment.name,
    }
  );

  const canContinue = await canSetFinishedProvisioning({
    trx,
    environment,
    environmentCommands,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "finished_provisioning",
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
