import { job } from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { JOB_MAP, knownJobTypes } from "../common/jobs";
import { log } from "../../common/logger";

export async function doAJob(processor: string): Promise<void> {
  const db = getDatabaseConnection();
  // Grab the job outside of a transaction to prevent deadlocking
  // issues and ensure a job only gets assigned a single worker
  const jobToDo = await job.todo(db, knownJobTypes, processor);
  if (!jobToDo) {
    log.debug("No job to do");
    return;
  }

  const heartbeat = setInterval(async () => {
    await job.pulse(db, processor, jobToDo.id);
  }, 30000);

  return db.transaction(async (trx) => {
    log.debug("Performing a job", { jobToDo });
    const jobFn = JOB_MAP[jobToDo.type];
    try {
      await jobFn(trx, jobToDo.payload as any);
      await job.jobComplete(trx, processor, jobToDo.id);
    } catch (e) {
      const message =
        `Job ${jobToDo.id} failed with:\n\n` + e.message + e.stack;
      log.error("Job failed", { jobToDo, message });
      await job.jobFailed(trx, processor, jobToDo.id, message);
    } finally {
      clearInterval(heartbeat);
    }
  });
}
