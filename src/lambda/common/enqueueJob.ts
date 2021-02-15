import { job } from "./entities";
import { JOB_MAP, JobKey } from "./jobs";
import { ConnectionOrTransaction } from "./db";
import { log } from "../../common/logger";
import { getJobSystem } from "./jobs/getJobSystem";

type JobFns = typeof JOB_MAP;

interface JobOptions {
  /**
   * The delay (in MS) before this job should be processed
   */
  startAfter?: number;
  /**
   * All jobs have a timeout. The default timeout is 30 seconds. Pass in a
   * millisecond value after startAfter that the job should be cancelled.
   * For example, if you want your job to be cancelled after 15 seconds,
   * pass in 15000
   */
  cancelAfter?: number;
  retries?: number;
  retryDelaySeconds?: number;
}

export async function enqueueJob<T extends JobKey>(
  trx: ConnectionOrTransaction,
  type: T,
  payload: Parameters<JobFns[T]>[1],
  {
    startAfter = 0,
    cancelAfter = 1000 * 30,
    retries,
    retryDelaySeconds,
  }: JobOptions = {}
): Promise<void> {
  const system = await getJobSystem();
  await system.enqueueJob(type, payload);
}
