import { environment as envEntity, Environment } from "../../entities";
import { Transaction, getDatabaseConnection } from "../../db";
import { log } from "../../../../common/logger";
import { processNewEnvironment } from "./new";
import { processProvisioningEnvironment } from "./provisioning";
import { processFinishedProvisioningEnvironment } from "./finishedProvisioning";
import { processStoppingEnvironment } from "./stopping";
import { processSnapshottingEnvironment } from "./snapshotting";
import { processCreatingEnvironment } from "./creating";
import { processStartingFromSnapshot } from "./startingFromSnapshot";

const doNothing = (trx: Transaction, environment: Environment) => {
  log.error("Unhandled processEnvironment lifecycle status", {
    environment: environment.subdomain,
    status: environment.lifecycleStatus,
  });
  return Promise.resolve();
};

const environmentStatusProcessor: Record<
  Environment["lifecycleStatus"],
  (trx: Transaction, environment: Environment) => Promise<void>
> = {
  new: processNewEnvironment,
  provisioning: processProvisioningEnvironment,
  finished_provisioning: processFinishedProvisioningEnvironment,
  stopping: processStoppingEnvironment,
  snapshotting: processSnapshottingEnvironment,
  creating: processCreatingEnvironment,
  error_provisioning: doNothing,
  ready: doNothing,
  starting: doNothing,
  starting_from_snapshot: processStartingFromSnapshot,
  stopped: doNothing,
} as const;

export async function processEnvironment(payload: { environmentId: string }) {
  const db = getDatabaseConnection();

  const environment = await envEntity.getByIdOrFail(db, payload.environmentId);
  await envEntity.touch(db, environment.id);

  try {
    await db.transaction(async (trx) => {
      log.info(
        `Working on ${environment.subdomain}. Status: ${environment.lifecycleStatus}`
      );
      await environmentStatusProcessor[environment.lifecycleStatus](
        trx,
        environment
      );
    });
  } catch (e) {
    log.error(
      `Environment processor threw an error while processing environment: ${environment.subdomain}`,
      {
        message: e.message,
        stack: e.stack,
      }
    );
  } finally {
    await envEntity.setNotWorking(db, environment.id);
  }
}
