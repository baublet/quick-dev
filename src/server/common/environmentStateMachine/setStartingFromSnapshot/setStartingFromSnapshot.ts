import { environment as envEntity, environmentAction } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetStartingFromSnapshotArguments } from ".";
import { canSetStartingFromSnapshot } from "./canSetStartingFromSnapshot";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";

export async function setStartingFromSnapshot({
  trx,
  environment,
}: SetStartingFromSnapshotArguments): Promise<StateMachineReturnValue> {
  const canContinue = await canSetStartingFromSnapshot({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    log.warn("Unable to set environment starting from snapshot", {
      canContinue,
      environment: environment.subdomain,
    });
    return canContinue;
  }

  log.debug(
    "setStartingFromSnapshot: Setting environment to status: starting from snapshot",
    {
      environment: environment.subdomain,
    }
  );

  try {
    const createdDroplet = await getExternalEnvironmentHandler(
      environment
    ).newEnvironment(environment);

    await envEntity.update(trx, environment.id, {
      lifecycleStatus: "starting_from_snapshot",
      sourceId: createdDroplet.id,
    });

    log.debug(
      "setStartingFromSnapshot: Updated environment to starting from snapshot",
      {
        environment: environment.subdomain,
        createdDroplet,
      }
    );

    return {
      operationSuccess: true,
      errors: [],
    };
  } catch (e) {
    return {
      operationSuccess: false,
      errors: [e.message],
    };
  }
}
