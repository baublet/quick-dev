import Queue from "bee-queue";
import { log } from "../../common/logger";

import { JOB_MAP, JobQueuePayload, JobKey, JobPayload } from "./jobs";

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
  timeout?: number;
  retries?: number;
  retryDelaySeconds?: number;
}

declare global {
  module NodeJS {
    interface Global {
      queue?: Queue<JobQueuePayload>;
    }
  }
}

export function getQueue() {
  if (!global.queue) {
    global.queue = new Queue<JobQueuePayload>("strapyard", {
      redis: process.env.REDIS_CREDENTIALS,
      activateDelayedJobs: true,
    });
  }

  return global.queue;
}

export function processQueue() {
  return getQueue().process(jobProcessor);
}

export function stopProcessingQueue() {
  getQueue().close(10000);
  delete global.queue;
}

export async function jobProcessor({
  data: { job, payload },
}: Queue.Job<JobQueuePayload>) {
  if (!(job in JOB_MAP)) {
    throw new Error(`Job type not found: ${JSON.stringify({ job, payload })}`);
  }
  try {
    log.debug(`Running job ${job}`, { payload });
    await JOB_MAP[job](payload as any);
    log.debug(`Job ${job} finished`, { payload });
  } catch (e) {
    log.error(`${job} failed!`, { payload, e: e.message, stack: e.stack });
    throw e;
  }
}

function getJob<T extends JobKey>(
  job: T,
  payload: JobPayload[T]
): JobQueuePayload {
  return ({
    job,
    payload,
  } as unknown) as JobQueuePayload;
}

export async function enqueueJob<T extends JobKey>(
  type: T,
  payload: JobPayload[T],
  {
    startAfter = 3000,
    timeout = 1000 * 30,
    retries = 2,
    retryDelaySeconds = 1,
  }: JobOptions = {}
): Promise<void> {
  const now = new Date();
  const delayUntil = new Date(now.valueOf() + startAfter);

  return new Promise((resolve) => {
    const queue = getQueue();
    const job = queue.createJob(getJob(type, payload));

    job
      .timeout(timeout)
      .retries(retries)
      // .delayUntil(delayUntil)
      .timeout(timeout)
      .backoff("fixed", retryDelaySeconds)
      .save()
      .then((job) => {
        log.debug(`Job ${type} scheduled`, {
          job: {
            id: job.id,
            status: job.status,
            options: job.options,
          },
        });
        resolve();
      });
  });
}
