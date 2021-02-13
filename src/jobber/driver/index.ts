import {
  Job,
  JobFunction,
  JobMap,
  JobPayload,
  JobSystem,
  Worker,
} from "../index";

export function getJobberDriverDefaults() {
  return {};
}

export type AnyJobberDriver = any;

export type JobberDriver = {
  addJobHistory: (jobId: string, message: string) => Promise<void>;
  enqueueJob: (
    jobName: string,
    payload: JobPayload,
    opts?: { startAfter?: number; retries?: number; retryDelay?: number }
  ) => Promise<Job>;
  getWorkerByIdOrFail: (id: string) => Promise<Worker>;
  getActiveWorkers: () => Promise<Worker[]>;
  getAllWorkers: () => Promise<Worker[]>;
  getExpiredWorkers: () => Promise<Worker[]>;
  getJobFunctionOrFail: (job: Job, jobs: JobMap) => Promise<JobFunction>;
  getJobByIdOrFail: (jobId: string) => Promise<Job>;
  getIdleWorkers: () => Promise<Worker[]>;
  getOrphanJobs: () => Promise<Job[]>;
  getOutstandingJobs: () => Promise<Job[]>;
  getWorkersToExpire: () => Promise<Worker[]>;
  driverName: string;
  initialize: (driver: AnyJobberDriver, jobs: JobMap) => Promise<void>;
  log: (
    level: "error" | "debug" | "info" | "warn",
    message: string,
    ...data: any[]
  ) => void;
  registerWorker: (id: string) => Promise<void>;
  resetJobForRetry: (jobId: string) => Promise<void>;
  scheduleJob: (jobId: string, workerId: string) => Promise<void>;
  schedulerTick: (jobSystem: JobSystem) => Promise<void>;
  setJobWaiting: (jobId: string) => Promise<void>;
  setJobReady: (jobId: string) => Promise<void>;
  setJobWorking: (jobId: string) => Promise<void>;
  setJobSuccess: (jobId: string) => Promise<void>;
  setJobFailed: (jobId: string) => Promise<void>;
  setJobCancelled: (jobId: string) => Promise<void>;
  setWorkerWorking: (workerId: string) => Promise<void>;
  setWorkerIdle: (workerId: string) => Promise<void>;
  setWorkerExpired: (workerId: string) => Promise<void>;
  workerTick: (jobSystem: JobSystem, workerId: string) => Promise<void>;
  workerPulse: (workerId: string) => Promise<void>;
};
