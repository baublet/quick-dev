import { ulid } from "ulid";

import { defaultLogger } from "../defaultLogger";
import { Job, UnserializedJob, Worker, getJobberDriverDefaults } from "../";
import { serializeJob } from "../serializeJob";

import { JobberPostgresDriver } from ".";
import { initialize } from "./initialize";
import { getConnectionFactory } from "./getConnectionFactory";
import { getWorkerTick } from "./getWorkerTick";

export function createPostgresDriver({
  migrationsTableName = "jobberMigration",
  workersTableName = "jobberWorker",
  jobsTableName = "jobberJob",
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
  workersTableName?: string;
  jobsTableName?: string;
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
    return getConnection<Worker>()(getWorkersTableName())
      .select("*")
      .whereNot("status", "=", "expired");
  }

  function getExpiredWorkers() {
    return getConnection<Worker>()(getWorkersTableName())
      .select("*")
      .where("status", "=", "expired");
  }

  function getMigrationsTableName() {
    return `"${schema}"."${migrationsTableName}"`;
  }

  function getJobsTableName() {
    return `"${schema}"."${jobsTableName}"`;
  }

  function getWorkersTableName() {
    return `"${schema}"."${workersTableName}"`;
  }

  const driver: Partial<JobberPostgresDriver> = {
    ...getJobberDriverDefaults(),
    // Data
    driverName: "postgres",
    migrationsTableName,
    workersTableName,
    jobsTableName,
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
      const results = await getConnection<UnserializedJob>()(getJobsTableName())
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
      return getConnection()<Worker>(getWorkersTableName()).select("*");
    },
    getIdleWorkers: () => {
      return getConnection<Worker>()
        .select("*")
        .from(getWorkersTableName())
        .andWhere((db) => {
          db.where("status", "=", "idle");
        });
    },
    getWorkersToExpire: () => {
      return getConnection<Worker>()
        .select("*")
        .from(getWorkersTableName())
        .andWhere((db) => {
          db.where(
            "lastPulse",
            "<=",
            getConnection<Worker>(false).raw("(now() - '1 minute'::interval)")
          );
        });
    },
    expireWorker: async (worker) => {
      const results = await getConnection<Worker>()(getWorkersTableName())
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
      return getConnection<Job>()(getJobsTableName())
        .select("*")
        .andWhere((db) => {
          db.whereIn("id", expiredJobIds);
          db.whereNotIn("status", ["cancelled", "failed"]);
        });
    },
    getOutstandingJobs: () => {
      return getConnection<Job>()(getJobsTableName())
        .select("*")
        .where("status", "=", "waiting");
    },
    scheduleJob: async (job, worker) => {
      const workerPromise = getConnection<Worker>()(getWorkersTableName())
        .update({
          jobId: job.id,
        })
        .where("id", "=", worker.id)
        .limit(1);
      const jobPromise = getConnection<Job>()(getJobsTableName())
        .update({
          status: "ready",
        })
        .where("id", "=", job.id)
        .limit(1);
      await Promise.all([jobPromise, workerPromise]);
    },
    registerWorker: async (workerId) => {
      const results = await getConnection<Worker>()(getWorkersTableName())
        .insert({
          id: workerId,
          lastPulse: new Date(),
          status: "idle",
        })
        .returning("*");

      return results[0];
    },
    getConnection,
    log: logger,
    initialize,
    getMigrationsTableName,
    getJobsTableName,
    getWorkersTableName,
  };

  driver.performJob = () => {};
  driver.resetJobForRetry = () => {};
  driver.schedulerTick = () => {};
  driver.workerPulse = () => {};
  driver.workerTick = getWorkerTick(driver as JobberPostgresDriver);

  return driver as Required<JobberPostgresDriver>;
}
