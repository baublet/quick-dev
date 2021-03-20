import { environment as envEntity } from "../../entities";
import { getDatabaseConnection } from "../../db";
import { log } from "../../../../common/logger";
import { processNewEnvironment } from "./new";
import { processProvisioningEnvironment } from "./provisioning";
import { processFinishedProvisioningEnvironment } from "./finishedProvisioning";
import { processStoppingEnvironment } from "./stopping";
import { processSnapshottingEnvironment } from "./snapshotting";

export async function processEnvironment(payload: { environmentId: string }) {
  const db = getDatabaseConnection();

  let subdomain: string = "unknown";
  let id: string | undefined;

  const environment = await envEntity.getByIdOrFail(db, payload.environmentId);
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
          await processStoppingEnvironment(trx, environment);
          break;
        case "snapshotting":
          await processSnapshottingEnvironment(trx, environment);
          break;
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
