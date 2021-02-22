import { environmentLock } from "../common/entities";
import { environment as envEntity } from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";
import { processNewEnvironment } from "./new";
import { processProvisioningEnvironment } from "./provisioning";

export async function processEnvironment() {
  const db = getDatabaseConnection();
  let subdomain: string = "unknown";
  let id: string | undefined;
  try {
    const environment = await envEntity.getEnvironmentThatNeedsWork(db);
    if (!environment) {
      log.debug("processEnvironment.ts: No environments need processing...");
      return;
    }

    await environmentLock.create(db, environment.id);
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
        default:
          break;
      }
    });
  } catch (e) {
    if (id) {
      await environmentLock.del(db, id);
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
