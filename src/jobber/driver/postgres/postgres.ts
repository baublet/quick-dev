import { ulid } from "ulid";

import { defaultLogger } from "../defaultLogger";
import { Job, UnserializedJob, Worker } from "../";
import { serializeJob } from "../serializeJob";

import { JobberPostgresDriver } from ".";
import { initialize } from "./initialize";
import { getConnectionFactory } from "./getConnectionFactory";

export function createPostgresDriver({
  migrationsTableName = "jobberMigrations",
  workerTableName = "jobberWorkers",
  jobTableName = "jobberJobs",
  host,
  port,
  schema = "public",
  username,
  password,
  database,
  logger = defaultLogger,
}: {
  host: string;
  port: number;
  schema?: string;
  username: string;
  password: string;
  database: string;
  migrationsTableName?: string;
  workerTableName?: string;
  jobTableName?: string;
  logger?: typeof defaultLogger;
}): JobberPostgresDriver {
  const getConnection = getConnectionFactory({
    host,
    port,
    schema,
    username,
    password,
    database,
  });

  function getActiveWorkers() {
    return getConnection<Worker>()("worker")
      .select("*")
      .whereNot("status", "=", "expired");
  }

  function getExpiredWorkers() {
    return getConnection<Worker>()("worker")
      .select("*")
      .where("status", "=", "expired");
  }

  return {
    // Data
    driverName: "postgres",
    migrationsTableName,
    workerTableName,
    jobTableName,
    host,
    port,
    schema,
    username,
    password,
    database,

    // Methods
    enqueueJob: async (
      jobName,
      payload,
      { retryDelay = 0, retries = 0, startAfter = Date.now() } = {}
    ) => {
      const results = await getConnection<UnserializedJob>()("job")
        .insert({
          id: ulid(),
          name: jobName,
          payload: JSON.stringify(payload),
          retries,
          startAfter,
          retryDelay,
          status: "waiting",
        })
        .returning("*");

      return serializeJob(results[0]);
    },
    getAllWorkers: () => {
      return getConnection<Worker>().select("*").from("worker");
    },
    getIdleWorkers: () => {
      return getConnection<Worker>()
        .select("*")
        .from("worker")
        .andWhere((db) => {
          db.where("status", "=", "idle");
        });
    },
    getWorkersToExpire: () => {
      return getConnection<Worker>()
        .select("*")
        .from("worker")
        .andWhere((db) => {
          db.where(
            "lastPulse",
            "<=",
            getConnection<Worker>(false).raw("(now() - '1 minute'::interval)")
          );
        });
    },
    expireWorker: async (worker) => {
      const results = await getConnection<Worker>()("worker")
        .update({ status: "expired" })
        .where("id", "=", worker.id)
        .limit(1)
        .returning("*");
      return results[0];
    },
    getActiveWorkers,
    getExpiredWorkers,
    getOrphanJobs: async () => {
      const expiredWorkers = await getExpiredWorkers();
      const expiredJobIds = expiredWorkers
        .filter((worker) => Boolean(worker.jobId))
        .map((worker) => worker.jobId) as string[];
      return getConnection<Job>()("job")
        .select("*")
        .andWhere((db) => {
          db.whereIn("id", expiredJobIds);
          db.whereNotIn("status", ["cancelled", "failed"]);
        });
    },
    getOutstandingJobs: () => {
      return getConnection<Job>()("job")
        .select("*")
        .where("status", "=", "waiting");
    },
    scheduleJob: async (job, worker) => {
      const workerPromise = getConnection<Worker>()("worker")
        .update({
          jobId: job.id,
        })
        .where("id", "=", worker.id)
        .limit(1);
      const jobPromise = getConnection<Job>()("job")
        .update({
          status: "ready",
        })
        .where("id", "=", job.id)
        .limit(1);
      await Promise.all([jobPromise, workerPromise]);
    },
    registerWorker: async (workerId) => {
      const results = await getConnection<Worker>()("worker")
        .insert({
          id: workerId,
          lastPulse: new Date(),
          status: "idle",
        })
        .returning("*");

      return results[0];
    },
    performJob: () => {},
    resetJobForRetry: () => {},
    schedulerTick: () => {},
    workerPulse: () => {},
    workerTick: () => {},
    getConnection,
    log: logger,
    initialize,
  };
}
