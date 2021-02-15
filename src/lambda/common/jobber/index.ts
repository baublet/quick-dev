import { AnyJobberDriver } from "./driver";
export { JobberPostgresDriver, createPostgresDriver } from "./driver/postgres";
export { createJobSystem } from "./createJobSystem";

export interface JobSystem<
  Driver extends AnyJobberDriver = AnyJobberDriver,
  Jobs extends JobMap = any
> {
  driver: Driver;
  enqueueJob: <Key extends keyof Jobs = string>(
    jobId: Key,
    payload: Parameters<Jobs[Key]>[0]
  ) => Promise<void>;
  jobs: Jobs;
  maybeResetJobForRetry: (jobId: string) => Promise<void>;
  performJob: (workerId: string, jobId: string) => Promise<void>;
  workerPulseInterval: number;
  workerTick: (workerId: string) => Promise<void>;
  schedulerTick: () => Promise<void>;
}

export type JobFunction = (payload: any) => Promise<void>;
export type JobMap = Record<string, JobFunction>;
export type EnqueueJobFunction<
  T extends JobMap = {},
  K extends keyof T = string
> = (job: K, payload: Parameters<T[K]>[0]) => Promise<void>;

export type JobStatus =
  | "waiting"
  | "ready"
  | "working"
  | "success"
  | "failed"
  | "cancelled";

export interface Worker {
  id: string;
  jobId?: string;
  lastPulse: Date;
  status: "idle" | "working" | "expired";
}

export type JobPayload = Record<string, string | number | boolean>;

export type JobHistoryEntry = {
  createdAt: Date;
  message: string;
};

export interface Job {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: JobStatus;
  name: string;
  payload: JobPayload;
  history: JobHistoryEntry[];
  attempts: number;
  retries: number;
  startAfter: Date;
  retryDelay: number;
}

export interface UnserializedJob {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: JobStatus;
  name: string;
  payload: string;
  history: string;
  attempts: number;
  retries: number;
  startAfter: string;
  retryDelay: number;
}
