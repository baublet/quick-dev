require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { hri } from "human-readable-ids";

import { log } from "../common/logger";
import { doAJob } from "./worker-background/doAJob";

const maxBeats = 1;

export const handler = async () => {
  let heartbeats = 0;
  const processor = hri.random();

  const intervalNumber = setInterval(async () => {
    if (heartbeats++ >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    log.debug("Worker heartbeat");
    await doAJob(processor);
  }, 1000);
};
