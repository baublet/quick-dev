import { ConnectionOrTransaction } from "../../db";
import { IntermediateJob } from "./index";

export async function pulse(
  trx: ConnectionOrTransaction,
  processor: string,
  jobId: string
) {
  await trx<IntermediateJob>("jobs")
    .update({
      id: jobId,
      processor,
      updated_at: trx.fn.now(),
      pulse: trx.fn.now(),
    })
    .where("id", "=", jobId)
    .limit(1);
}
