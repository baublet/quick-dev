import { ConnectionOrTransaction } from "../../common/db";
import { IntermediateJob, JobHistory } from "./index";
import { getById } from "./getById";

export async function jobComplete(
  trx: ConnectionOrTransaction,
  processor: string,
  jobId: number
) {
  const historyItem: JobHistory = {
    action: "endWork",
    date: new Date(),
    processor,
  };
  const job = await getById(trx, jobId);
  const history = JSON.parse(job.history);
  history.push(historyItem);
  job.status = "done";
  job.history = JSON.stringify(history);
  await trx<IntermediateJob>("jobs")
    .update(job)
    .where("id", "=", jobId)
    .limit(1);
}
