require("./common/initialize");

import { createHumanReadableId } from "./common/createHumanReadableId";
import { log } from "../common/logger";
import { doAJob } from "./worker-background/doAJob";

const maxBeats = 1;

export const handler = async () => {
  let heartbeats = 0;
  const processor = createHumanReadableId();

  const intervalNumber = setInterval(async () => {
    if (heartbeats++ >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    log.debug("Worker heartbeat");
    await doAJob(processor);
  }, 1000);
};
