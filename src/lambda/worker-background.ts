require("./common/initialize");

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import {
  stopProcessingQueue,
  processQueue,
  getQueue,
  enqueueJob,
} from "./common/enqueueJob";
import { environment } from "./common/entities";

declare global {
  module NodeJS {
    interface Global {
      working: boolean;
    }
  }
}

async function queueJobsForEnvironmentsThatNeedWork() {
  const db = getDatabaseConnection();

  const environments = await environment.getEnvironmentsThatNeedsWork(db);

  if (environments.length === 0) {
    return;
  }

  return Promise.all(
    environments.map(async (env) => {
      log.debug(
        `Enqueuing process environment job for environment ${env.name}`
      );
      await environment.setWorking(db, env.id);
      await enqueueJob("processEnvironment", { environmentId: env.id });
    })
  );
}

export const handler = () => {
  return new Promise<void>(async (resolve) => {
    // Environment processor
    const environmentWatcherInterval = setInterval(async () => {
      await queueJobsForEnvironmentsThatNeedWork();
    }, 1000);

    // Jobs processor
    if (!global.working) {
      global.working = true;
      processQueue();
    }

    // Cleanup
    setTimeout(async () => {
      if (global.working) {
        await stopProcessingQueue();
        global.working = false;
      }
      clearInterval(environmentWatcherInterval);
      resolve();
    }, 5000);
  });
};
