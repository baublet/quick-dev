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
    log.debug("No environments need work...");
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
    await queueJobsForEnvironmentsThatNeedWork();
    if (global.working) return resolve();
    global.working = true;
    processQueue();
    setTimeout(async () => {
      await stopProcessingQueue();
      global.working = false;
      resolve();
    }, 5000);
  });
};
