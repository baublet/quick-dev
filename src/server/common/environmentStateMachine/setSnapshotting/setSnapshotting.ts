import {
  environment as envEntity,
  environmentAction,
  environmentSnapshot,
} from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetSnapshottingArguments } from ".";
import { canSetSnapshotting } from "./canSetSnapshotting";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";

export async function setSnapshotting({
  trx,
  environment,
}: SetSnapshottingArguments): Promise<StateMachineReturnValue> {
  const canContinue = await canSetSnapshotting({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    log.warn("Unable to set environment snapshotting", {
      canContinue,
      environment: environment.subdomain,
    });
    return canContinue;
  }

  log.debug("setSnapshotting: Setting environment to status: snapshotting", {
    environment: environment.subdomain,
  });

  await environmentAction.deleteByEnvironmentId(trx, environment.id);

  log.debug("setSnapshotting: creating action in provider", {
    environment: environment.subdomain,
  });
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
    ipv4: "",
  });

  log.debug("setSnapshotting: Updated environment to snapshotting", {
    environment: environment.subdomain,
    createdAction,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
