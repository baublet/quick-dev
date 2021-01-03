import { ConnectionOrTransaction } from "../../common/db";
import { IntermediateJob, JobHistory } from "./index";
import { getById } from "./getById";

export async function jobFailed(
  trx: ConnectionOrTransaction,
  processor: string,
  jobId: number,
  output: string
) {
  const historyItem: JobHistory = {
    action: "fail",
    date: new Date(),
    processor,
    output,
  };
  const job = await getById(trx, jobId);
  const history = JSON.parse(job.history);
  history.push(historyItem);
  job.status = "failed";
  job.processor = null;
  await trx<IntermediateJob>("jobs")
    .update(job)
    .where("id", "=", jobId)
    .limit(1);
}
