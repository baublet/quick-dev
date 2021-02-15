import { UnserializedJob, Job } from "../index";

export function serializeJob(job: UnserializedJob): Job {
  return {
    ...job,
    payload: JSON.parse(job.payload),
    history: JSON.parse(job.history),
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt),
    startAfter: new Date(job.startAfter),
  };
}
