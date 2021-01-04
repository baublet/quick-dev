require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { APIGatewayEvent } from "aws-lambda";
import { hri } from "human-readable-ids";

import { doAJob } from "./worker-background/doAJob";

// 5 seconds worth of jobs
const maxBeats = 5;

export const handler = async (event: APIGatewayEvent) => {
  let heartbeats = 0;
  const processor = hri.random();

  const intervalNumber = setInterval(async () => {
    if (heartbeats++ >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    doAJob(processor);
  }, 1000);
};
