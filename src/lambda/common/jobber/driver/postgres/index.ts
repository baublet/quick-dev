import knex from "knex";

import { JobberDriver } from "..";
import { JobStatus } from "../..";

export { createPostgresDriver } from "./postgres";

export interface Migration {
  id: string;
  createdAt: Date;
  migration: number;
  migrationSql: string;
}

export interface MigrationEntity {
  id: string;
  created_at: Date;
  migration: number;
  migration_sql: string;
}

export interface WorkerEntity {
  id: string;
  updated_at: Date;
  created_at: Date;
  job_id?: string;
  last_pulse: Date;
  status: "idle" | "working" | "expired";
}

export interface UnserializedJobEntity {
  id: string;
  created_at: string;
  updated_at: string;
  status: JobStatus;
  name: string;
  payload: string;
  history: string;
  attempts: number;
  retries: number;
  start_after: string;
  retry_delay: number;
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
  jobHistoriesTableName: string;
  getConnection: () => knex<any, unknown[]>;
  getMigrationsTableName: () => string;
  getJobsTableName: () => string;
  getJobHistoriesTableName: () => string;
  getWorkersTableName: () => string;
}
