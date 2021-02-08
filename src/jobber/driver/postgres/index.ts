import knex from "knex";

import { JobberDriver, JobMap } from "..";

export interface JobberPostgresDriver extends JobberDriver {
  host: string;
  port: number;
  schema: string;
  username: string;
  password: string;
  database: string;
  migrationsTableName: string;
  workerTableName: string;
  jobTableName: string;
  getConnection: () => knex<any, unknown[]>;
}
