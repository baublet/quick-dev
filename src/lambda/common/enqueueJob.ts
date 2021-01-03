import { JobType, create } from "./jobs";
import { JOB_MAP } from "../worker-background/jobs";
import { ConnectionOrTransaction } from "./db";
import { log } from "../../common/logger";

type JobFns = typeof JOB_MAP;

export async function enqueueJob<T extends JobType>(
  trx: ConnectionOrTransaction,
  type: T,
  payload: Parameters<JobFns[T]>[1]
): Promise<void> {
  log.debug("Enqueueing job", {
    type,
    payload,
  });
  await create(trx, {
    type,
    payload,
  });
}
