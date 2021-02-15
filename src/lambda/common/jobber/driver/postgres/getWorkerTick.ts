import { JobberPostgresDriver, WorkerEntity } from "./index";
import { JobSystem } from "../../index";

async function isWorkerBusy(
  driver: JobberPostgresDriver,
  workerId: string
): Promise<boolean> {
  const worker = await driver
    .getConnection()<WorkerEntity>(driver.workersTableName)
    .withSchema(driver.schema)
    .select("*")
    .where("id", "=", workerId)
    .limit(1);

  if (worker.length === 0) {
    return false;
  }

  if (worker[0].status === "working") {
    return true;
  }

  return false;
}

async function registerWorkerIfNecessary(
  driver: JobberPostgresDriver,
  workerId: string
): Promise<void> {
  const connection = driver.getConnection();
  const worker = await connection<WorkerEntity>(driver.workersTableName)
    .withSchema(driver.schema)
    .select("*")
    .where("id", "=", workerId)
    .limit(1);

  if (worker.length === 0) {
    await driver.registerWorker(workerId);
    return;
  }

  if (worker[0].status === "expired") {
    driver.log("debug", `Jobber: worker ${workerId} expired. Resurrecting it`);
    await connection<WorkerEntity>(driver.workersTableName)
      .withSchema(driver.schema)
      .update({ status: "idle", last_pulse: connection.raw("now()") })
      .where("id", "=", workerId)
      .limit(1);
  }
}

export function getWorkerTick() {
  return async (system: JobSystem<JobberPostgresDriver>, workerId: string) => {
    const driver = system.driver;
    if (await isWorkerBusy(driver, workerId)) {
      driver.log(
        "debug",
        `Jobber: worker ${workerId} is busy. Skipping worker tick`
      );
      return;
    }
    await registerWorkerIfNecessary(driver, workerId);
    await driver.workerPulse(workerId);

    const worker = await driver.getWorkerByIdOrFail(workerId);
    const jobId = worker.jobId;
    if (!jobId) {
      driver.log(
        "debug",
        `Jobber: worker ${worker.id} has no job assigned. Idling`,
        { worker }
      );
      return;
    }

    await system.performJob(worker.id, jobId);
  };
}
