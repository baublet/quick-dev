import { job } from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { knownJobTypes } from "../common/jobs";
import { log } from "../../common/logger";

export async function scheduleJob(processor: string): Promise<void> {
  const db = getDatabaseConnection();
  return db.transaction(async (trx) => {
    const scheduledJob = await job.schedule(trx, knownJobTypes, processor);

    if (scheduledJob) {
      log.debug("Scheduling a job", { scheduledJob });
    } else {
      log.debug("No job to schedule");
    }
  });
}
