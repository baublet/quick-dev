require("@babel/polyfill/noConflict");
require("dotenv").config();

import { APIGatewayEvent } from "aws-lambda";
import { hri } from "human-readable-ids";

import { doAJob } from "./worker-background/doAJob";

// 5 minutes worth of jobs
const maxBeats = 360;

export const handler = async (event: APIGatewayEvent) => {
  let heartbeats = 0;
  const processor = hri.random();

  const intervalNumber = setInterval(async () => {
    if (heartbeats >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    doAJob(processor);
  }, 1000);
};
