import { UnserializedJob, Job } from ".";

export function serializeJob(job: UnserializedJob): Job {
  return {
    ...job,
    payload: JSON.parse(job.status),
  };
}
