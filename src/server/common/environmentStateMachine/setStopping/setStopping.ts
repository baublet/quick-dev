import { environment as envEntity, environmentAction } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetStoppingArguments } from ".";
import { canSetStopping } from "./canSetStopping";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";

export async function setStopping({
  trx,
  environment,
  environmentDomainRecords,
}: SetStoppingArguments): Promise<StateMachineReturnValue> {
  log.debug("setStopping: Setting environment to status: stopping", {
    environment: environment.subdomain,
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
  const createdAction = await getExternalEnvironmentHandler(
    environment
  ).shutdownEnvironment(environment, environmentDomainRecords);
  await environmentAction.create(trx, {
    actionPayload: JSON.stringify(createdAction),
    environmentId: environment.id,
  });

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "stopping",
  });

  log.debug(
    "setFinishedProvisioning: Updated environment to finished provisioning",
    { environment: environment.subdomain }
  );

  return {
    operationSuccess: true,
    errors: [],
  };
}
