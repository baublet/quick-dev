require("./common/initialize");

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import {
  stopProcessingQueue,
  processQueue,
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

  await Promise.all(
    environments.map(async (env) => {
      log.debug(
        `Enqueuing process environment job for environment ${env.name}`
      );

      // Collision protection here -- `setWorking` returns false if it's already
      // working, so we don't want to work if it's already working
      const canContinue = await environment.setWorking(db, env.id);
      if (canContinue) {
        await enqueueJob(
          "processEnvironment",
          { environmentId: env.id },
          { startAfter: 0 }
        );
      }
    })
  );
}

export const handler = async () => {
  await enqueueJob("rescueStuckEnvironments", undefined);

  async function queueJobs() {
    if (!global.working) {
      return;
    }
    await queueJobsForEnvironmentsThatNeedWork();
    setTimeout(async () => {
      await queueJobs();
    }, 1000);
  }

  return new Promise<void>(async (resolve) => {
    if (!global.working) {
      global.working = true;
      // Jobs processor
      await processQueue();
      // Environment processor
      await queueJobs();
    }

    // Cleanup
    setTimeout(async () => {
      if (global.working) {
        await stopProcessingQueue();
        global.working = false;
      }
      resolve();
    }, 5000);
  });
};
