import {
  environmentAction,
  Environment,
  environmentDomainRecord,
} from "../../entities";
import { Transaction } from "../../db";
import { log } from "../../../../common/logger";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { environmentStateMachine } from "../../environmentStateMachine";
import { digitalOceanApi } from "../../externalEnvironmentHandler/digitalOcean/digitalOceanApi";

export async function processSnapshottingEnvironment(
  trx: Transaction,
  environment: Environment
) {
  const environmentSnapshot = await DigitalOceanHandler.getSnapshot(
    environment
  );

  if (!environmentSnapshot) {
    log.warn(
      `Environment suggests it is snapshotting, but no image found in the provider`,
      {
        environmentSubdomain: environment.subdomain,
        sourceSnapshotId: environment.sourceSnapshotId,
      }
    );
    return;
  }

  if (environmentSnapshot.status === "pending") {
    return;
  }

  if (environmentSnapshot.status === "deleted") {
    log.error(
      `Waiting for an environment snapshot to finish that got deleted!`,
      {
        environmentSnapshot,
        environment: environment.subdomain,
      }
    );
    return;
  }

  const result = await environmentStateMachine.setStopped({ trx, environment });
  if (result.operationSuccess) {
    log.error(
      `processSnapshottingEnvironment: Unexpected error setting environment as stopped ${environment.subdomain}`,
      {
        result,
      }
    );
  }
}
