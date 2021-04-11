import Queue from "bee-queue";
import { log } from "../../common/logger";

import { JOB_MAP, JobQueuePayload, JobKey, JobPayload } from "./jobs";

interface JobOptions {
  /**
   * All jobs have a timeout. The default timeout is 30 seconds. Pass in a
   * millisecond value after startAfter that the job should be cancelled.
   * For example, if you want your job to be cancelled after 15 seconds,
   * pass in 15000
   */
  timeout?: number;
  retries?: number;
  retryDelaySeconds?: number;
  onFail?: () => void;
  onRetry?: () => void;
}

declare global {
  module NodeJS {
    interface Global {
      queue?: Queue<JobQueuePayload>;
    }
  }
}

export function getQueue() {
  const credentials = JSON.parse(process.env.REDIS_CONNECTION || "''");
  if (!credentials) {
    log.error(
      "enqueueJob.ts: No redis connection (REDIS_CONNECTION) found in environment."
    );
    process.exit(1);
  }
  if (!global.queue) {
    global.queue = new Queue<JobQueuePayload>("strapyard", {
      redis: credentials,
      activateDelayedJobs: true,
    });
  }

  return global.queue;
}

export function processQueue() {
  return getQueue().process(jobProcessor);
}

export async function stopProcessingQueue() {
  // Wait as long as 12 minutes to let pending jobs run
  await getQueue().close(1000 * 60 * 12);
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
    timeout = 1000 * 30,
    retries = 2,
    retryDelaySeconds = 1,
    onFail,
    onRetry,
  }: JobOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    const queue = getQueue();
    const job = queue.createJob(getJob(type, payload));

    if (onFail) {
      job.on("failed", onFail);
    }

    if (onRetry) {
      job.on("retrying", onRetry);
    }

    job
      .timeout(timeout)
      .retries(retries)
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
