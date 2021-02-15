import { ulid } from "ulid";
import { JobberPostgresDriver, MigrationEntity } from ".";
import { deseralizeError } from "../../createJobSystem";

const migrations: string[] = [
  `CREATE TABLE $migrationsTable (
    id            TEXT PRIMARY KEY,
    created_at    TIMESTAMPTZ NOT NULL,
    migration     SMALLSERIAL UNIQUE NOT NULL,
    migration_sql TEXT UNIQUE NOT NULL
  );`,
  `CREATE TABLE $jobsTable (
    id          TEXT PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    status      TEXT NOT NULL,
    name        TEXT NOT NULL,
    payload     TEXT NOT NULL,
    history     TEXT NOT NULL,
    attempts    INT NOT NULL,
    retries     INT NOT NULL,
    start_after TIMESTAMPTZ NOT NULL,
    retry_delay INT NOT NULL
  );`,
  `CREATE INDEX job_status_index ON $jobsTable ("status");`,
  `CREATE TABLE $workersTable (
    id          TEXT PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    job_id      TEXT UNIQUE REFERENCES $jobsTable,
    status      TEXT NOT NULL,
    last_pulse  TIMESTAMPTZ NOT NULL
  );`,
  `CREATE INDEX worker_status_index ON $workersTable ("status");`,
  `CREATE INDEX worker_pulse_index ON $workersTable ("last_pulse");`,
];

async function getMigrationsToRun(
  driver: JobberPostgresDriver
): Promise<string[]> {
  try {
    const connection = driver.getConnection();
    const existingMigrations = await connection<MigrationEntity>(
      driver.migrationsTableName
    )
      .withSchema(driver.schema)
      .select("*");
    const newestIndex = existingMigrations.reduce(
      (latest, migration) =>
        migration.migration > latest ? migration.migration : latest,
      0
    );
    driver.log("debug", "Jobber: migrations needed to run", {
      newestIndex,
      existingMigrations,
    });
    return migrations.slice(newestIndex + 1);
  } catch (e) {
    driver.log("warn", "Jobber: unexpected error migrating", {
      error: deseralizeError(e),
    });
    return migrations.slice(0);
  }
}

function replaceMigrationVariables(
  driver: JobberPostgresDriver,
  migration: string
): string {
  return migration
    .replace(/\$jobsTable/g, driver.getJobsTableName())
    .replace(/\$workersTable/g, driver.getWorkersTableName())
    .replace(/\$migrationsTable/g, driver.getMigrationsTableName());
}

async function runMigration(
  driver: JobberPostgresDriver,
  migration: string,
  first: boolean = false
): Promise<void> {
  const connection = driver.getConnection();
  try {
    const rawMigration = replaceMigrationVariables(driver, migration);
    if (first) {
      driver.log("debug", "Jobber: running initial migration");
      await connection.raw(rawMigration);
      return;
    }
    await driver.getConnection().transaction(async (trx) => {
      driver.log("debug", `Jobber: running migrations\n\n${rawMigration}`);
      await trx.raw(rawMigration);
      const migrationRecord = await trx<MigrationEntity>(
        driver.migrationsTableName
      )
        .withSchema(driver.schema)
        .insert({
          id: ulid(),
          created_at: trx.raw("now()"),
          migration_sql: migration,
        })
        .returning("*");
      driver.log("info", "Jobber: migration run successfully", {
        rawMigration,
        migrationRecord,
      });
    });
  } catch (e) {
    driver.log("error", "Jobber: error running a migration", {
      migration,
      rawError: e,
      message: e.message,
      stack: e.stack,
    });
    throw e;
  }
}

export async function initialize(driver: JobberPostgresDriver) {
  driver.log("debug", `Jobber: initializing driver ${driver.driverName}`);
  const migrationsToRun = await getMigrationsToRun(driver);
  for (const migration of migrationsToRun) {
    await runMigration(
      driver,
      migration,
      migration.includes("CREATE TABLE $migrationsTable")
    );
  }
  driver.log("debug", `Jobber: driver ${driver.driverName} initialized`);
}
