import {
  environment as envEntity,
  environmentAction as envActionEntity,
  environmentSnapshot,
} from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetStoppedArguments } from ".";
import { canSetStopped } from "./canSetStopped";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { enqueueJob } from "../../enqueueJob";

export async function setStopped({
  trx,
  environment,
}: SetStoppedArguments): Promise<StateMachineReturnValue> {
  log.debug("setStopped: Setting environment to status: stopped", {
    environment: environment.subdomain,
  });

  const canContinue = await canSetStopped({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  // Now, grab the snapshot so we can get the image ID
  const snapshot = await DigitalOceanHandler.getSnapshot(environment);
  if (!snapshot) {
    log.error(
      "setStopped: Expected environment to have a snapshot by now, but it doesn't...",
      {
        environment: environment.subdomain,
        snapshot,
      }
    );
    return {
      errors: [
        "Cannot set a environment to stopped if it has no snapshot! Otherwise, we couldn't start it again...",
      ],
      operationSuccess: false,
    };
  }

  await environmentSnapshot.create(trx, {
    environmentId: environment.id,
    source: "digital_ocean",
    sourceId: snapshot.id,
    sizeInGb: snapshot.sizeInGb,
  });

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "stopped",
    sourceSnapshotId: snapshot.id,
    ipv4: "",
    working: false,
  });

  log.debug("setStopped: Updated environment to stopped", {
    environment: environment.subdomain,
  });

  await enqueueJob("deleteEnvironmentInProvider", {
    environmentId: environment.id,
  });
  await envActionEntity.deleteByEnvironmentId(trx, environment.id);

  return {
    operationSuccess: true,
    errors: [],
  };
}
