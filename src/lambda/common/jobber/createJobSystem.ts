import { JobMap, JobSystem } from "./index";
import { JobberDriver } from "./driver/index";

export function deseralizeError(error: Error) {
  return `${error.message}

${error.stack}`;
}

export async function createJobSystem<
  Jobs extends JobMap,
  Driver extends JobberDriver
>({
  driver,
  jobs,
  workerPulseInterval = 30000,
}: {
  driver: Driver;
  jobs: Jobs;
  workerPulseInterval?: number;
}): Promise<JobSystem<Driver, Jobs>> {
  await driver.initialize(driver, jobs);

  const enqueueJob = async <Key extends keyof Jobs>(
    job: Key,
    payload: Parameters<Jobs[Key]>[0]
  ) => {
    driver.log("debug", `Enqueueing job ${job}`, { payload });
    const createdJob = await driver.enqueueJob(`${job}`, payload);
    driver.log("info", `Job ${job} created`, { createdJob });
  };

  const maybeResetJobForRetry = async (jobId: string) => {
    const job = await driver.getJobByIdOrFail(jobId);
    // Maybe retry
    driver.log(
      "warn",
      `Jobber: Job ${job.name} (${job.id}) failed. Attempt ${job.attempts} of ${
        job.retries + 1
      }`
    );
    if (job.attempts >= job.retries) {
      await driver.setJobFailed(job.id);
    } else {
      await driver.resetJobForRetry(job.id);
    }
  };

  const performJob = async (workerId: string, jobId: string) => {
    const job = await driver.getJobByIdOrFail(jobId);
    const worker = await driver.getWorkerByIdOrFail(workerId);
    const jobFunction = await driver.getJobFunctionOrFail(job, jobs);

    driver.log(
      "debug",
      `Performing job ${job.name} (${jobId}) with worker ${worker.id}`
    );
    await driver.workerPulse(worker.id);
    const interval = setInterval(async () => {
      await driver.workerPulse(worker.id);
    }, workerPulseInterval);

    try {
      await Promise.all([
        driver.setWorkerWorking(worker.id),
        driver.setJobWorking(job.id),
        driver.addJobHistory(job.id, "Jobber: starting job"),
      ]);
      await jobFunction(job.payload);
      await Promise.all([
        driver.addJobHistory(job.id, "Jobber: job finished successfully"),
        driver.setWorkerIdle(worker.id),
        driver.setJobSuccess(jobId),
      ]);
    } catch (e) {
      driver.log(
        "error",
        `Worker ${worker.id} received error while performing job (${job.name}) ${jobId}`,
        {
          job,
          error: deseralizeError(e),
        }
      );

      await driver.addJobHistory(
        job.id,
        "Jobber: job failed with error\n\n" + deseralizeError(e)
      );
      await driver.setWorkerIdle(worker.id);
      await system.maybeResetJobForRetry(job.id);
    }

    clearInterval(interval);
  };

  const system: JobSystem<Driver, Jobs> = {
    driver,
    enqueueJob,
    maybeResetJobForRetry,
    performJob,
    jobs,
    workerPulseInterval,
    workerTick: (workerId) => {
      return driver.workerTick(system, workerId);
    },
    schedulerTick: () => {
      return driver.schedulerTick(system);
    },
  };

  return system;
}
