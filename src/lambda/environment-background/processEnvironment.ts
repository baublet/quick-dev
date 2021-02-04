import { environment as envEntity } from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";
import { processNewEnvironment } from "./new";
import { processProvisioningEnvironment } from "./provisioning";

/**
 * Takes an environment that needs work done on it, ticks it over to a
 * liminal status (e.g., "*ing"), and performs the work. If we're in a
 * long-running liminal status, we check the status again against our env
 * handler, and either update the status OR do nothing, and keep waiting...
 */
export async function processEnvironment(currentProcessor: string) {
  const db = getDatabaseConnection();
  let subdomain: string = "unknown";
  let id: string;
  try {
    const environment = await envEntity.getEnvironmentCommandThatNeedsWork(db, {
      currentProcessor,
    });
    if (!environment) {
      log.debug("processEnvironment.ts: No environments need processing...");
      return;
    }
    await db.transaction(async (trx) => {
      id = environment.id;
      subdomain = environment.subdomain;
      log.info(
        `Environment processor ${currentProcessor} working on ${subdomain}`
      );

      switch (environment.lifecycleStatus) {
        case "new":
          await processNewEnvironment(trx, environment);
          break;
        case "provisioning":
          await processProvisioningEnvironment(trx, environment);
        default:
          break;
      }
    });
  } catch (e) {
    log.error(
      `Environment processor ${currentProcessor} threw an error while processing environment: ${subdomain}`,
      {
        message: e.message,
        stack: e.stack,
      }
    );
    throw e;
  }
}
