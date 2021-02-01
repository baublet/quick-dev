import { JobKey } from "../../jobs";

export type JobType = JobKey;

export type JobStatus = "ready" | "working" | "failed" | "done";

export interface JobHistory {
  action: "startWork" | "fail" | "endWork";
  processor: string;
  date: Date;
  output?: string;
}

export interface Job {
  id: string;
  created_at: Date;
  updated_at: Date;
  startAfter: number;
  cancelAfter: number;
  retries: number;
  retriesRemaining: number;
  retryDelaySeconds: number;
  payload: Record<string, any>;
  type: JobType;
  status: JobStatus;
  processor?: string | null;
  history: JobHistory[];
}

export type IntermediateJob = Omit<Job, "payload" | "history"> & {
  payload: string;
  history: string;
};

export { create } from "./create";
export { todo } from "./todo";
export { jobComplete } from "./jobComplete";
export { jobFailed } from "./jobFailed";
export { get } from "./get";
export { toCancel } from "./toCancel";
