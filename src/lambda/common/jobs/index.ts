import { JobKey } from "../../worker-background/jobs";

export type JobType = JobKey;

export type JobStatus = "ready" | "working" | "failed" | "done";

export interface JobHistory {
  action: "startWork" | "fail" | "endWork";
  processor: string;
  date: Date;
  output?: string;
}

export interface Job {
  id: number | string;
  created_at: Date;
  updated_at: Date;
  payload: Record<string, any>;
  type: JobType;
  status: JobStatus;
  processor?: string;
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
