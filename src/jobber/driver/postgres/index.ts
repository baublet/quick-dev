import knex from "knex";

import { JobberDriver } from "..";

export { createPostgresDriver } from "./postgres";

export interface Migration {
  id: string;
  createdAt: Date;
  migration: number;
  migrationSql: string;
}

export interface JobberPostgresDriver extends JobberDriver {
  host: string;
  port: number;
  schema: string;
  username: string;
  password: string;
  database: string;
  migrationsTableName: string;
  workersTableName: string;
  jobsTableName: string;
  getConnection: () => knex<any, unknown[]>;
  getMigrationsTableName: () => string;
  getJobsTableName: () => string;
  getWorkersTableName: () => string;
}
