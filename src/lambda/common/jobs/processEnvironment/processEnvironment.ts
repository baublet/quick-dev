import { environment as envEntity, Environment } from "../../entities";
import { Transaction, getDatabaseConnection } from "../../db";
import { log } from "../../../../common/logger";
import { processNewEnvironment } from "./new";
import { processProvisioningEnvironment } from "./provisioning";
import { processFinishedProvisioningEnvironment } from "./finishedProvisioning";
import { processStoppingEnvironment } from "./stopping";
import { processSnapshottingEnvironment } from "./snapshotting";

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
  new: (trx, environment) => {
    return processNewEnvironment(trx, environment);
  },
  provisioning: (trx, environment) => {
    return processProvisioningEnvironment(trx, environment);
  },
  finished_provisioning: (trx, environment) => {
    return processFinishedProvisioningEnvironment(trx, environment);
  },
  stopping: (trx, environment) => {
    return processStoppingEnvironment(trx, environment);
  },
  snapshotting: (trx, environment) => {
    return processSnapshottingEnvironment(trx, environment);
  },
  creating: doNothing,
  error_provisioning: doNothing,
  ready: doNothing,
  starting: doNothing,
  starting_from_snapshot: doNothing,
  stopped: doNothing,
} as const;

export async function processEnvironment(payload: { environmentId: string }) {
  const db = getDatabaseConnection();

  const environment = await envEntity.getByIdOrFail(db, payload.environmentId);
  await envEntity.touch(db, environment.id);

  try {
    await db.transaction(async (trx) => {
      log.info(`Working on ${environment.subdomain}`);
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
