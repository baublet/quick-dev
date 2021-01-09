import {
  getEnvironmentThatNeedsWork,
  resetProcessorByEnvironmentId,
} from "../common/environment";
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
    const environment = await getEnvironmentThatNeedsWork(db, {
      currentProcessor,
    });
    await db.transaction(async (trx) => {
      if (!environment) {
        log.debug("processEnvironment.ts: No environments need processing...");
        return;
      }

      if (environment) {
        id = environment.id;
        subdomain = environment.subdomain;
        log.info(
          `Environment processor ${currentProcessor} working on ${subdomain}`
        );
      }

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

    if (id) {
      await resetProcessorByEnvironmentId(db, id);
    }
  } catch (e) {
    let resettingToRetry = false;
    if (id !== undefined) {
      resettingToRetry = true;
      await resetProcessorByEnvironmentId(db, id);
    }
    log.error(
      `Environment processor ${currentProcessor} threw an error while processing environment: ${subdomain}`,
      {
        message: e.message,
        stack: e.stack,
        resettingToRetry,
      }
    );
  }
}
