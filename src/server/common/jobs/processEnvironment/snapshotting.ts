import { environment as envEntity, Environment } from "../../entities";
import { Transaction } from "../../db";
import { log } from "../../../../common/logger";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";
import { environmentStateMachine } from "../../environmentStateMachine";

export async function processSnapshottingEnvironment(
  trx: Transaction,
  environment: Environment
) {
  log.debug("processSnapshottingEnvironment", {
    environment: environment.subdomain,
  });

  const environmentSnapshot = await getExternalEnvironmentHandler(
    environment
  ).getSnapshot(environment);

  if (!environmentSnapshot) {
    log.debug(
      `Environment suggests it is snapshotting, but no image found in the provider. Waiting longer...`,
      {
        environmentSubdomain: environment.subdomain,
        sourceSnapshotId: environment.sourceSnapshotId,
      }
    );
    return;
  }

  if (environmentSnapshot.status === "pending") {
    log.debug("Environment still snapshotting", { environmentSnapshot });
    await envEntity.touch(trx, environment.id);
    return;
  }

  if (environmentSnapshot.status === "deleted") {
    log.warn(
      `Waiting for an environment snapshot to finish that got deleted!`,
      {
        environmentSnapshot,
        environment: environment.subdomain,
      }
    );
    return;
  }

  const result = await environmentStateMachine.setStopped({ trx, environment });
  if (!result.operationSuccess) {
    log.error(
      `processSnapshottingEnvironment: Unexpected error setting environment as stopped ${environment.subdomain}`,
      {
        result,
        environment: {
          subdomain: environment.subdomain,
          lifecycleState: environment.lifecycleStatus,
        },
      }
    );
  }
}
