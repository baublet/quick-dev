import { job } from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";

export async function cancelTimedOutJob(processor: string): Promise<void> {
  const db = getDatabaseConnection();

  const jobToCancel = await job.toCancel(db, processor);

  if (!jobToCancel) {
    return;
  }

  log.warn(
    `Job ${jobToCancel.type} outstayed its welcome. Setting it as failed`,
    {
      jobToCancel,
    }
  );
  await job.jobFailed(
    db,
    processor,
    jobToCancel.id,
    `Cancelled after timeout by ${processor}`
  );
}
