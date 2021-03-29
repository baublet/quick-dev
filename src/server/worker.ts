import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import {
  processQueue,
  stopProcessingQueue,
  enqueueJob,
} from "./common/enqueueJob";
import { environment } from "./common/entities";

async function queueJobsForEnvironmentsThatNeedWork() {
  const db = getDatabaseConnection();

  const environments = await environment.getEnvironmentsThatNeedWork(db);

  if (environments.length === 0) {
    return;
  }

  await Promise.all(
    environments.map(async (env) => {
      log.debug(
        `worker: Enqueuing process environment job for environment ${env.name}`
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
      } else {
        log.warn(
          "worker: COLLISION DETECTED! Can't process an environment that's working",
          { canContinue, environment: env.subdomain }
        );
      }
    })
  );
}

export const worker = async () => {
  return new Promise<void>(async (resolve) => {
    // Regular worker process
    await processQueue();

    // Rescuing stuck environments
    await enqueueJob("rescueStuckEnvironments", undefined);

    // Normal environment operations
    await queueJobsForEnvironmentsThatNeedWork();
    const environmentQueue = setInterval(async () => {
      await queueJobsForEnvironmentsThatNeedWork();
    }, 1000);

    setTimeout(async () => {
      console.log("Worker finishing...");
      await stopProcessingQueue();
      clearInterval(environmentQueue);
      process.exit();
    }, 1000 * 60);
  });
};

process.on("SIGINT", async (code) => {
  log.debug(
    `Exit code received (${code}). Attempting to exit worker gracefully...`
  );
  await stopProcessingQueue();
  log.debug("Successfully shut down!");
});

worker();
