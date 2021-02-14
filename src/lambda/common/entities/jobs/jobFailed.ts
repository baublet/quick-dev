import { ConnectionOrTransaction } from "../../db";
import { IntermediateJob, JobHistory } from "./index";
import { getById } from "./getById";
import { log } from "../../../../common/logger";

export async function jobFailed(
  trx: ConnectionOrTransaction,
  processor: string,
  jobId: string,
  output: string
) {
  const historyItem: JobHistory = {
    action: "fail",
    date: new Date(),
    processor,
    output,
  };
  const job = await getById(trx, jobId);

  if (!job) {
    throw new Error(
      `Job invariance violation! Tried to perform jobFailed task on job ${jobId}, but couldn't find that job!`
    );
  }

  const history = JSON.parse(job.history);
  history.push(historyItem);
  job.processor = null;
  job.history = JSON.stringify(history);

  if (job.retriesRemaining > 0) {
    const originalCancelAfter = job.cancelAfter - job.startAfter;
    job.retriesRemaining = job.retriesRemaining - 1;
    job.status = "ready";
    job.startAfter = Date.now() + job.retryDelaySeconds * 1000;
    job.cancelAfter = job.startAfter + originalCancelAfter;
    log.warn(
      `Job ${job.type} failed. Retrying after ${job.retryDelaySeconds} seconds (retries left: ${job.retriesRemaining})`,
      {
        historyItem,
        job,
      }
    );
  } else {
    job.status = "failed";
  }

  await trx<IntermediateJob>("jobs")
    .update({
      ...job,
      updated_at: trx.fn.now(),
    })
    .where("id", "=", jobId)
    .limit(1);
}
