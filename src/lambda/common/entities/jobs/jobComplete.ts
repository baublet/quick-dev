import { ConnectionOrTransaction } from "../../db";
import { IntermediateJob, JobHistory } from "./index";
import { getById } from "./getById";

export async function jobComplete(
  trx: ConnectionOrTransaction,
  processor: string,
  jobId: string
) {
  const historyItem: JobHistory = {
    action: "endWork",
    date: new Date(),
    processor,
  };
  const job = await getById(trx, jobId);

  if (!job) {
    throw new Error(
      `Job invariance violation! Tried to set job ${job} complete, but it doesn't exist!`
    );
  }

  const history = JSON.parse(job.history);
  history.push(historyItem);
  job.status = "done";
  job.history = JSON.stringify(history);
  job.processor = null;
  await trx<IntermediateJob>("jobs")
    .update({
      ...job,
      updated_at: trx.fn.now(),
    })
    .where("id", "=", jobId)
    .limit(1);
}
