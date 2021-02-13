import { JobberPostgresDriver } from ".";
import { Worker } from "../";

async function isWorkerBusy(driver: JobberPostgresDriver): Promise<boolean> {
  const worker = await driver
    .getConnection()<Worker>(driver.getWorkersTableName())
    .select("*")
    .where("id", "=", driver.workerName)
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
  driver: JobberPostgresDriver
): Promise<void> {
  const worker = await driver
    .getConnection()<Worker>(driver.getWorkersTableName())
    .select("*")
    .where("id", "=", driver.workerName)
    .limit(1);

  if (worker.length === 0) {
    await driver.registerWorker(driver.workerName);
    return;
  }

  if (worker[0].status === "expired") {
    driver.log(
      "debug",
      `Worker ${driver.workerName} expired. Resurrecting it...`
    );
    await driver
      .getConnection()<Worker>(driver.getWorkersTableName())
      .update({ status: "idle" })
      .where("id", "=", driver.workerName)
      .limit(1);
  }
}

export function getWorkerTick(driver: JobberPostgresDriver) {
  return async () => {
    if (await isWorkerBusy(driver)) {
      driver.log(
        "debug",
        `Worker ${driver.workerName} is busy. Skipping worker tick...`
      );
      return;
    }
    await registerWorkerIfNecessary(driver);
    driver.getConnection()<Worker>(driver.getWorkersTableName());
  };
}
