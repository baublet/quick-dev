import { environment as envEntity } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetStoppingArguments } from ".";
import { canSetStopping } from "./canSetStopping";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";

export async function setStopping({
  trx,
  environment,
  environmentDomainRecords,
}: SetStoppingArguments): Promise<StateMachineReturnValue> {
  log.debug("setStopping: Setting environment to status: stopping", {
    environment: environment.name,
  });

  const canContinue = await canSetStopping({
    trx,
    environment,
    environmentDomainRecords,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  // Tell our environment provider to shut it down and record the action
  await DigitalOceanHandler.shutdownEnvironment(
    environment,
    environmentDomainRecords
  );

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
