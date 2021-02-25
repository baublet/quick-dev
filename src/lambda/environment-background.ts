require("./common/initialize");

import { log } from "../common/logger";
import { processEnvironment } from "./environment-background/processEnvironment";

const maxBeats = 1;

export const handler = async () => {
  for (let i = 0; i < maxBeats; i++) {
    log.debug("Environment Worker heartbeat");
    await processEnvironment();
  }
};
