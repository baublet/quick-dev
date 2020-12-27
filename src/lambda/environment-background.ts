require("@babel/polyfill/noConflict");
require("dotenv").config();
require('source-map-support').install();

import { APIGatewayEvent } from "aws-lambda";
import { ulid } from "ulid";

import { processEnvironment } from "./environment-background/processEnvironment";

// 5 seconds worth of jobs
const maxBeats = 1;

export const handler = async (event: APIGatewayEvent) => {
  let heartbeats = 0;
  const processor = ulid();

  const intervalNumber = setInterval(async () => {
    if (heartbeats++ >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    await processEnvironment(processor);
  }, 1000);
};
