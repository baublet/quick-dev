import { log } from "../../common/logger";

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
}
