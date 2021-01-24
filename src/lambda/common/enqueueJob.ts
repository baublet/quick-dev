import { job } from "./entities";
import { JOB_MAP, JobKey } from "./jobs";
import { ConnectionOrTransaction } from "./db";
import { log } from "../../common/logger";

type JobFns = typeof JOB_MAP;

interface JobOptions {
  after?: number;
}

export async function enqueueJob<T extends JobKey>(
  trx: ConnectionOrTransaction,
  type: T,
  payload: Parameters<JobFns[T]>[1],
  { after = 0 }: JobOptions = {}
): Promise<void> {
  log.debug("Enqueueing job", {
    type,
    payload,
  });
  await job.create(trx, {
    type,
    payload,
    after,
  });
}
