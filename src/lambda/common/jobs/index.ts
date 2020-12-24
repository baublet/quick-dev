export type JobType = "create_environment";

export type JobStatus = "ready" | "working" | "failed" | "done";

export interface Job {
  id: number;
  created_at: Date;
  updated_at: Date;
  payload: string;
  type: JobType;
  status: JobStatus;
  processor: string;
}

export { create } from "./create";
export { todo } from "./todo";
