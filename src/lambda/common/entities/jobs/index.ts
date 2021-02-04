import { JobKey } from "../../jobs";

export type JobType = JobKey;

export type JobStatus = "waiting" | "ready" | "working" | "failed" | "done";

export interface JobHistory {
  action: "startWork" | "fail" | "endWork";
  processor: string;
  date: Date;
  output?: string;
}

export interface Job {
  id: string;
  cancelAfter: number;
  created_at: Date;
  history: JobHistory[];
  payload: Record<string, any>;
  processor?: string | null;
  pulse: number;
  retries: number;
  retriesRemaining: number;
  retryDelaySeconds: number;
  startAfter: number;
  status: JobStatus;
  type: JobType;
  updated_at: Date;
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
export { pulse } from "./pulse";
export { schedule } from "./schedule";
