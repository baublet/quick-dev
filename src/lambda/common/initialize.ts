import { log } from "../../common/logger";
import { enqueueJob } from "../common/enqueueJob";

export {};

declare global {
  module NodeJS {
    interface Global {
      initialized: boolean;
    }
  }
}

if (!global.initialized) {
  global.initialized = true;
  log.debug("Initializing...");
  require("dotenv").config();
  // require("source-map-support").install();

  (async () => await enqueueJob("updateEnvironmentStrapYardUrls", undefined))();
}
