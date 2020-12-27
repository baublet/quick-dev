import {
  getEnvironmentThatNeedsWork,
  resetEnvironmentId,
} from "../common/environment";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";

import { processCreatingEnvironment } from "./creating";
import { processNewEnvironment } from "./new";

/**
 * Takes an environment that needs work done on it, ticks it over to a
 * liminal status (e.g., "*ing"), and performs the work. If we're in a
 * long-running liminal status, we check the status again against our env
 * handler, and either update the status OR do nothing, and keep waiting...
 */
export async function processEnvironment(currentProcessor: string) {
  let subdomain: string = "unknown";
  let id: number;
  try {
    const environment = await getEnvironmentThatNeedsWork(
      getDatabaseConnection(),
      {
        currentProcessor,
      }
    );

    if (!environment) {
      log.debug("No environments need processing...");
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
        await processNewEnvironment(environment);
        break;
      default:
        await processCreatingEnvironment(environment);
        break;
    }
  } catch (e) {
    let resettingToRetry = false;
    if (id !== undefined) {
      resettingToRetry = true;
      await resetEnvironmentId(getDatabaseConnection(), id);
    }
    log.error(
      `Environment processor ${currentProcessor} threw and error while processing environment: ${subdomain}`,
      {
        message: e.message,
        stack: e.stack,
        resettingToRetry,
      }
    );
  }
}
