import { log } from "../../../common/logger";
import {
  createPostgresDriver,
  createJobSystem,
  JobSystem,
  JobberPostgresDriver,
} from "../../../jobber";

import { JOB_MAP } from "./index";

declare global {
  namespace NodeJS {
    interface Global {
      __JOB_SYSTEM__: JobSystem<JobberPostgresDriver, typeof JOB_MAP>;
    }
  }
}

export async function getJobSystem() {
  if (!global.__JOB_SYSTEM__) {
    if (!process.env.DATABASE_CONNECTION) {
      log.debug(
        "db.ts: No database connection (DATABASE_CONNECTION) found in environment."
      );
      process.exit();
    }
    const dbDetails = JSON.parse(process.env.DATABASE_CONNECTION).connection;
    log.debug("Initializing job system with DB details: ", dbDetails);
    global.__JOB_SYSTEM__ = await createJobSystem({
      driver: createPostgresDriver({
        database: dbDetails.database,
        host: dbDetails.host,
        port: dbDetails.port,
        password: dbDetails.password,
        username: dbDetails.user,
      }),
      jobs: JOB_MAP,
    });
  }

  return global.__JOB_SYSTEM__;
}
