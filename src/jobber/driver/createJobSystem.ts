import { JobSystem, JobberDriver, JobMap, EnqueueJobFunction } from "./index";

export async function createJobSystem<Jobs extends JobMap>({
  driver,
  jobs,
  workerPulseInterval = 30000,
}: {
  driver: JobberDriver;
  jobs: Jobs;
  workerPulseInterval?: number;
}): Promise<JobSystem<Jobs>> {
  await driver.initialize(jobs);

  const enqueueJob = async <Key extends keyof Jobs>(
    job: Key,
    payload: Parameters<Jobs[Key]>[0]
  ) => {
    driver.log("debug", `Enqueueing job ${job}`, { payload });
    const createdJob = await driver.enqueueJob(`${job}`, payload);
    driver.log("info", `Job ${job} created`, { createdJob });
  };

  return {
    driver,
    enqueueJob,
    jobs,
    workerPulseInterval,
  };
}
