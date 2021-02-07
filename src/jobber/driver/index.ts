export interface Worker {
  id: string;
  jobId?: string;
  lastPulse: Date;
  status: "idle" | "working" | "expired";
}

export type JobPayload = Record<string, string | number | boolean>;

export interface Job {
  id: string;
  status: "waiting" | "ready" | "success" | "failed" | "cancelled";
  name: string;
  payload: JobPayload;
  history: string[];
  attempts: number;
  retries: number;
  startAfter: number;
  retryDelay: number;
}

export type AnyJobberDriver = any;

export type JobberDriver = {
  enqueueJob: (jobName: string, payload: JobPayload) => Promise<Job>;
  expireWorker: (worker: Worker) => Promise<Worker>;
  getAllWorkers: () => Promise<Worker[]>;
  getDeadJobs: () => Promise<Job[]>;
  getIdleWorkers: () => Promise<Worker[]>;
  getOutstandingJobs: () => Promise<Job[]>;
  getWorkersToExpire: () => Promise<Worker[]>;
  driverName: string;
  initialize: (driver: AnyJobberDriver, jobs: JobMap) => Promise<void>;
  log: (
    level: "error" | "debug" | "info" | "warn",
    message: string,
    ...data: any[]
  ) => void;
  performJob: (job: Job) => Promise<Job>;
  registerWorker: (worker: Pick<Worker, "id">) => Promise<Worker>;
  resetJobForRetry: (job: Job) => Promise<void>;
  scheduleJob: (job: Job, worker: Worker) => Promise<void>;
  schedulerTick: (jobSystem: JobSystem) => Promise<void>;
  workerTick: (jobSystem: JobSystem) => Promise<void>;
  workerPulse: (worker: Worker) => Promise<Worker>;
};

export type JobFunction = (payload: JobPayload) => Promise<void>;
export type JobMap = Record<string, JobFunction>;
export type EnqueueJobFunction<
  T extends JobMap = {},
  K extends keyof T = string
> = (job: K, payload: Parameters<T[K]>[0]) => Promise<void>;

export interface JobSystem<Jobs extends JobMap = any> {
  driver: JobberDriver;
  enqueueJob: <Key extends keyof Jobs = string>(
    job: Key,
    payload: Parameters<Jobs[Key]>[0]
  ) => Promise<void>;
  jobs: Jobs;
  workerPulseInterval: number;
}
