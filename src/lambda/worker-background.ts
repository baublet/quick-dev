require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { APIGatewayEvent } from "aws-lambda";
import { hri } from "human-readable-ids";
import { log } from "../common/logger";

import { doAJob } from "./worker-background/doAJob";

// 5 seconds worth of jobs
const maxBeats = 1;

export const handler = async (event: APIGatewayEvent) => {
  let heartbeats = 0;
  const processor = hri.random();

  const intervalNumber = setInterval(async () => {
    log.debug("Worker heartbeat", { processor });
    if (heartbeats++ >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    doAJob(processor);
  }, 1000);
};
