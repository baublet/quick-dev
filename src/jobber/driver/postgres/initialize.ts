import { JobberPostgresDriver, Migration } from ".";

const migrations: string[] = [
  `CREATE TABLE $migrationsTable (
    id            TEXT PRIMARY KEY,
    createdAt     TIMESTAMPTZ NOT NULL,
    migration     SMALLSERIAL UNIQUE NOT NULL
    migrationSql  TEXT UNIQUE NOT NULL,
  );`,
  `CREATE TABLE $jobsTable (
    id          TEXT PRIMARY KEY,
    createdAt   TIMESTAMPTZ NOT NULL,
    updatedAt   TIMESTAMPTZ NOT NULL,
    status      TEXT NOT NULL,
    name        TEXT NOT NULL,
    payload     TEXT NOT NULL,
    history     TEXT NOT NULL,
    attempts    INT NOT NULL,
    retries     INT NOT NULL,
    startAfter  TIMESTAMPTZ NOT NULL,
    retryDelay  INT NOT NULL
  );`,
  `CREATE INDEX job_status_index ON $jobsTable ("status");`,
  `CREATE TABLE $workersTable (
    id          TEXT PRIMARY KEY,
    createdAt   TIMESTAMPTZ NOT NULL,
    updatedAt   TIMESTAMPTZ NOT NULL,
    jobId       TEXT UNIQUE REFERENCES $jobsTable,
    status      TEXT NOT NULL,
    lastPulse   TIMESTAMPTZ NOT NULL
  );`,
  `CREATE INDEX worker_status_index ON $workersTable ("status");`,
  `CREATE INDEX worker_pulse_index ON $workersTable ("lastPulse");`,
];

async function getMigrationsToRun(
  driver: JobberPostgresDriver
): Promise<string[]> {
  try {
    const connection = driver.getConnection();
    const existingMigrations = await connection<Migration>(
      driver.getMigrationsTableName()
    ).select("*");
    const newestIndex = existingMigrations.reduce(
      (latest, migration) =>
        migration.migration > latest ? migration.migration : latest,
      0
    );
    return migrations.slice(newestIndex + 1);
  } catch (e) {
    return migrations.slice(0);
  }
}

function replaceMigrationVariables(
  driver: JobberPostgresDriver,
  migration: string
): string {
  return migration
    .replace(/$jobsTable/g, driver.getJobsTableName())
    .replace(/$workersTable/g, driver.getWorkersTableName())
    .replace(/$migrationsTable/g, driver.getMigrationsTableName());
}

async function runMigration(
  driver: JobberPostgresDriver,
  migration: string
): Promise<void> {
  try {
    return driver.getConnection().transaction(async (trx) => {
      const rawMigration = replaceMigrationVariables(driver, migration);
      await trx.raw(rawMigration);
      const migrationRecord = await trx<Migration>(
        driver.getMigrationsTableName()
      ).insert({
        migrationSql: migration,
      });
      driver.log("info", "Jobber migration run successfully", {
        rawMigration,
        migrationRecord,
      });
    });
  } catch (e) {
    driver.log("error", "Error running a migration", {
      migration,
      rawError: e,
      message: e.message,
      stack: e.stack,
    });
    throw e;
  }
}

export async function initialize(driver: JobberPostgresDriver) {
  driver.log("debug", `Initializing Jobber: ${driver.driverName}`);
  const migrationsToRun = await getMigrationsToRun(driver);
  for (const migration of migrationsToRun) {
    await runMigration(driver, migration);
  }
  driver.log("debug", "Jobber initialized");
}
