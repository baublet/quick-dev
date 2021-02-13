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
    global.__JOB_SYSTEM__ = await createJobSystem({
      driver: createPostgresDriver({
        database: "",
        host: "",
        port: 5432,
        username: "",
        password: "",
      }),
      jobs: JOB_MAP,
    });
  }

  return global.__JOB_SYSTEM__;
}
