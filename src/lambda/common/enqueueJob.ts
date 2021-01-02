import { JobType, create } from "./jobs";
import { JOB_MAP } from "../worker-background/jobs";
import { ConnectionOrTransaction } from "./db";

type JobFns = typeof JOB_MAP;

export async function enqueueJob<T extends JobType>(
  trx: ConnectionOrTransaction,
  type: T,
  payload: Parameters<JobFns[T]>[2]
): Promise<void> {
  await create(trx, {
    type,
    payload,
  });
}
