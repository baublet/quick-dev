import { ulid } from "ulid";

import { defaultLogger } from "../defaultLogger";
import { getJobberDriverDefaults } from "../index";
import { UnserializedJob, Worker } from "../../index";
import { serializeJob } from "../serializeJob";

import { JobberPostgresDriver, UnserializedJobEntity, WorkerEntity } from ".";
import { initialize } from "./initialize";
import { getConnectionFactory } from "./getConnectionFactory";
import { getWorkerTick } from "./getWorkerTick";

function unserializedJobEntityToJob({
  created_at,
  retry_delay,
  start_after,
  updated_at,
  ...job
}: UnserializedJobEntity): UnserializedJob {
  return {
    ...job,
    createdAt: created_at,
    retryDelay: retry_delay,
    startAfter: start_after,
    updatedAt: updated_at,
  };
}

function workerEntityToWorker({ last_pulse, ...worker }: WorkerEntity): Worker {
  return {
    ...worker,
    lastPulse: last_pulse,
  };
}

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

  const driver: Partial<JobberPostgresDriver> &
    Omit<
      JobberPostgresDriver,
      "resetJobForRetry" | "schedulerTick" | "workerPulse" | "workerTick"
    > = {
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
      const results = await getConnection()<UnserializedJobEntity>(
        driver.jobsTableName
      )
        .withSchema(driver.schema)
        .insert({
          id: ulid(),
          name: jobName,
          payload: JSON.stringify(payload),
          retries,
          start_after: startAfter,
          retry_delay: retryDelay,
          status: "waiting",
        })
        .returning("*");

      return serializeJob(unserializedJobEntityToJob(results[0]));
    },
    getAllWorkers: async () => {
      const workers = await getConnection()<WorkerEntity>(
        driver.workersTableName
      )
        .withSchema(driver.schema)
        .select("*");
      return workers.map(workerEntityToWorker);
    },
    getIdleWorkers: async () => {
      const workers = await getConnection()<WorkerEntity>(
        driver.workersTableName
      )
        .withSchema(driver.schema)
        .select("*")
        .andWhere((db) => {
          db.where("status", "=", "idle");
        });
      return workers.map(workerEntityToWorker);
    },
    getWorkerByIdOrFail: async (workerId: string) => {
      const results = await getConnection()<WorkerEntity>(
        driver.workersTableName
      )
        .withSchema(driver.schema)
        .select("*")
        .where("id", "=", workerId);
      if (results.length === 0) {
        throw new Error(`Worker with ID ${workerId} not found!`);
      }
      return workerEntityToWorker(results[0]);
    },
    getWorkersToExpire: async () => {
      const connection = getConnection();
      const workers = await connection<WorkerEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .select("*")
        .andWhere((db) => {
          db.where(
            "last_pulse",
            "<=",
            connection.raw("(now() - '1 minute'::interval)")
          );
        });
      return workers.map(workerEntityToWorker);
    },
    getActiveWorkers,
    getExpiredWorkers,
    getOrphanJobs: async () => {
      const expiredWorkers = await getExpiredWorkers();
      const expiredJobIds = expiredWorkers
        .filter((worker) => Boolean(worker.jobId))
        .map((worker) => worker.jobId) as string[];
      const jobs = await getConnection()<UnserializedJobEntity>(
        driver.jobsTableName
      )
        .withSchema(driver.schema)
        .select("*")
        .andWhere((db) => {
          db.whereIn("id", expiredJobIds);
          db.whereNotIn("status", ["cancelled", "failed"]);
        });
      return jobs.map(unserializedJobEntityToJob).map(serializeJob);
    },
    getOutstandingJobs: async () => {
      const jobs = await getConnection()<UnserializedJobEntity>(
        driver.jobsTableName
      )
        .withSchema(driver.schema)
        .select("*")
        .where("status", "=", "waiting");
      return jobs.map(unserializedJobEntityToJob).map(serializeJob);
    },
    scheduleJob: async (jobId, workerId) => {
      const workerPromise = getConnection()<WorkerEntity>(
        driver.workersTableName
      )
        .withSchema(driver.schema)
        .update({
          job_id: jobId,
        })
        .where("id", "=", workerId)
        .limit(1);
      const jobPromise = getConnection<UnserializedJobEntity>()(
        driver.jobsTableName
      )
        .withSchema(driver.schema)
        .update({
          status: "ready",
        })
        .where("id", "=", jobId)
        .limit(1);
      await Promise.all([jobPromise, workerPromise]);
    },
    registerWorker: async (workerId) => {
      const connection = getConnection();
      await connection<WorkerEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .insert({
          id: workerId,
          updated_at: connection.raw("now()"),
          created_at: connection.raw("now()"),
          status: "idle",
          last_pulse: connection.raw("now()"),
        })
        .returning("*");
    },
    getConnection,
    log: logger,
    initialize,
    getMigrationsTableName,
    getJobFunctionOrFail: async (job, jobs) => {
      if (!jobs[job.name]) {
        driver.log("error", `Job ${job.name} not found in the jobs map`, {
          job,
          jobs,
        });
        throw new Error(`Job ${job.name} not found!`);
      }
      return jobs[job.name];
    },
    getJobsTableName,
    getWorkersTableName,
    getJobByIdOrFail: async (jobId: string) => {
      const results = await getConnection<UnserializedJob>()(
        driver.jobsTableName
      )
        .withSchema(driver.schema)
        .select("*")
        .where("id", "=", jobId)
        .limit(1);

      if (!results.length) {
        throw new Error(`Job ID not found: ${jobId}`);
      }

      return serializeJob(results[0]);
    },
    setWorkerExpired: async (workerId) => {
      await getConnection()<WorkerEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .update({ status: "expired" })
        .where("id", "=", workerId)
        .limit(1);
    },
    setWorkerIdle: async (workerId) => {
      await getConnection()<WorkerEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .update({ status: "idle", job_id: undefined })
        .andWhere((db) => {
          db.where("id", "=", workerId);
        })
        .limit(1);
    },
    setWorkerWorking: async (workerId) => {
      const results = await getConnection()<WorkerEntity>(
        driver.workersTableName
      )
        .withSchema(driver.schema)
        .update({ status: "working" })
        .andWhere((db) => {
          db.where("status", "=", "idle");
          db.where("id", "=", workerId);
        })
        .limit(1);

      if (results > 0) {
        return;
      }

      throw new Error(
        `Worker invariance violence. Try to set a worker to "working", but this is only allowed if the worker was idle. Either the worker did not exist, or it was not idle!`
      );
    },
    setJobCancelled: async (jobId) => {
      // Jobs can be set to cancel at any time
      await getConnection()<UnserializedJobEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .update({ status: "cancelled" })
        .where("id", "=", jobId)
        .limit(1);
    },
    setJobFailed: async (jobId) => {
      const job = await driver.getJobByIdOrFail(jobId);
      if (job.status !== "working") {
        throw new Error(
          `Job invariance violation. Cannot move a job to "failed" if it's not "working." Job ${job.id} (${job.name}) is in status ${job.status}`
        );
      }
      await getConnection()<UnserializedJobEntity>(driver.jobsTableName)
        .withSchema(driver.schema)
        .update({ status: "failed" })
        .where("id", "=", jobId)
        .limit(1);
    },
    setJobReady: async (jobId) => {
      const job = await driver.getJobByIdOrFail(jobId);
      if (job.status !== "waiting") {
        throw new Error(
          `Job invariance violation. Cannot move a job to "ready" if it's not "waiting." Job ${job.id} (${job.name}) is in status ${job.status}`
        );
      }
      await getConnection()<UnserializedJobEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .update({ status: "ready" })
        .where("id", "=", jobId)
        .limit(1);
    },
    setJobWorking: async (jobId) => {
      const job = await driver.getJobByIdOrFail(jobId);
      if (job.status !== "ready") {
        throw new Error(
          `Job invariance violation. Cannot move a job to "working" if it's not "ready." Job ${job.id} (${job.name}) is in status ${job.status}`
        );
      }
      const connection = getConnection();
      await connection<UnserializedJobEntity>(driver.workersTableName)
        .withSchema(driver.schema)
        .update({ status: "ready", attempts: connection.raw("attempts + 1") })
        .where("id", "=", jobId)
        .limit(1);
    },
    setJobSuccess: async (jobId) => {
      const job = await driver.getJobByIdOrFail(jobId);
      if (job.status !== "working") {
        throw new Error(
          `Job invariance violation. Cannot move a job to "success" if it's not "working." Job ${job.id} (${job.name}) is in status ${job.status}`
        );
      }
      await getConnection()<UnserializedJobEntity>(driver.jobsTableName)
        .withSchema(driver.schema)
        .update({ status: "ready" })
        .where("id", "=", job.id)
        .limit(1);
    },
    setJobWaiting: async (jobId) => {
      await getConnection()<UnserializedJobEntity>(driver.jobsTableName)
        .withSchema(driver.schema)
        .update({ status: "waiting" })
        .where("id", "=", jobId)
        .limit(1);
    },
    addJobHistory: async (jobId: string, message: string) => {
      const connection = driver.getConnection();
      const job = await driver.getJobByIdOrFail(jobId);
      job.history.push({ createdAt: new Date(), message });
      await connection<UnserializedJobEntity>(driver.jobsTableName)
        .withSchema(driver.schema)
        .update({
          history: JSON.stringify(job.history),
        })
        .where("id", "=", jobId);
    },
  };

  driver.resetJobForRetry = async (jobId) => {
    await driver.addJobHistory(jobId, "Jobber: retrying");
    return driver.setJobWaiting(jobId);
  };

  driver.schedulerTick = async (system) => {
    const driver = system.driver as JobberPostgresDriver;
    const idleWorkers = await driver.getIdleWorkers();

    if (idleWorkers.length === 0) {
      driver.log("debug", "Jobber: All workers busy, can't schedule work");
      return;
    }

    const jobsToSchedule = await driver.getOutstandingJobs();

    if (jobsToSchedule.length === 0) {
      driver.log("debug", "Jobber: No jobs waiting to be scheduled");
    }

    let i = 0;
    for (; i < idleWorkers.length; i++) {
      const worker = idleWorkers[i];
      const job = jobsToSchedule[i];
      if (!job) {
        driver.log(
          "debug",
          "More idle workers than jobs to do, skipping additional workers"
        );
        break;
      }
      await driver.scheduleJob(job.id, worker.id);
    }

    driver.log("debug", `Scheduled ${i} jobs`);
  };

  driver.workerPulse = async (workerId: string) => {
    const connection = driver.getConnection();
    await connection<WorkerEntity>(driver.workersTableName)
      .withSchema(driver.schema)
      .update({
        last_pulse: connection.raw("now()"),
      })
      .where("id", "=", workerId);
  };
  driver.workerTick = getWorkerTick();

  return driver as Required<JobberPostgresDriver>;
}
