import { environment as envEntity, environmentAction } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetSnapshottingArguments } from ".";
import { canSetSnapshotting } from "./canSetSnapshotting";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";

export async function setSnapshotting({
  trx,
  environment,
}: SetSnapshottingArguments): Promise<StateMachineReturnValue> {
  log.debug("setSnapshotting: Setting environment to status: snapshotting", {
    environment: environment.name,
  });

  const canContinue = await canSetSnapshotting({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  await environmentAction.deleteByEnvironmentId(trx, environment.id);

  // Tell our environment provider to shut it down and record the action
  const createdAction = await DigitalOceanHandler.snapshotEnvironment(
    environment
  );
  await environmentAction.create(trx, {
    actionPayload: JSON.stringify(createdAction),
    environmentId: environment.id,
  });

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "snapshotting",
  });

  log.debug("setSnapshotting: Updated environment to snapshotting", {
    environment: environment.subdomain,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
