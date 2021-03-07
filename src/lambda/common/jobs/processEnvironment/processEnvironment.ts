import { environment as envEntity } from "../../entities";
import { getDatabaseConnection } from "../../db";
import { log } from "../../../../common/logger";
import { processNewEnvironment } from "./new";
import { processProvisioningEnvironment } from "./provisioning";
import { processFinishedProvisioningEnvironment } from "./finishedProvisioning";

export async function processEnvironment(payload: { environmentId: string }) {
  const db = getDatabaseConnection();

  let subdomain: string = "unknown";
  let id: string | undefined;

  const environment = await envEntity.getById(db, payload.environmentId);
  if (!environment) {
    throw new Error(
      "Invariant violation. processEnvironment job queued up with invalid environment ID: " +
        payload.environmentId
    );
  }

  if (environment.deleted) {
    log.debug(
      "Environment process job cancelled because environment was deleted",
      { environment: environment.subdomain }
    );
    return;
  }

  await envEntity.touch(db, environment.id);

  try {
    id = environment.id;

    await db.transaction(async (trx) => {
      id = environment.id;
      subdomain = environment.subdomain;

      log.info(`Working on ${subdomain}`);

      switch (environment.lifecycleStatus) {
        case "new":
          await processNewEnvironment(trx, environment);
          break;
        case "provisioning":
          await processProvisioningEnvironment(trx, environment);
          break;
        case "finished_provisioning":
          await processFinishedProvisioningEnvironment(trx, environment);
          break;
        case "stopping":
        //
        default:
          break;
      }
    });

    await envEntity.setNotWorking(db, environment.id);
  } catch (e) {
    if (id) {
      await envEntity.setNotWorking(db, environment.id);
    }
    log.error(
      `Environment processor threw an error while processing environment: ${subdomain}`,
      {
        message: e.message,
        stack: e.stack,
      }
    );
    throw e;
  }
}
