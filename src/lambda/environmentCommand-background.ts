require("./common/initialize");

import { log } from "../common/logger";
import { processEnvironmentCommand } from "./environmentCommand-background/processEnvironmentCommand";

const maxBeats = 1;

export const handler = async () => {
  for (let i = 0; i < maxBeats; i++) {
    log.debug("Environment Command Worker heartbeat");
    await processEnvironmentCommand();
  }
};
