import { defaultLogger } from "../defaultLogger";
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
  return {
    migrationsTableName,
    workerTableName,
    jobTableName,
    driverName: "postgres",
    log: logger,
    initialize,
    host,
    port,
    schema,
    username,
    password,
    database,
    getConnection: getConnectionFactory({
      host,
      port,
      schema,
      username,
      password,
      database,
    }),
  };
}
