require("@babel/polyfill/noConflict");
require("dotenv").config();

import { APIGatewayEvent } from "aws-lambda";
import { ulid } from "ulid";

import { doAJob } from "./worker-background/doAJob";

// 5 seconds worth of jobs
const maxBeats = 5;

export const handler = async (event: APIGatewayEvent) => {
  let heartbeats = 0;
  const processor = ulid();

  const intervalNumber = setInterval(async () => {
    if (heartbeats >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    await doAJob(processor);
  }, 1000);
};
