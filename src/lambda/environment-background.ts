require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";
import { ulid } from "ulid";
import { log } from "../common/logger";

import { processEnvironment } from "./environment-background/processEnvironment";

const maxBeats = 1;

export const handler = async (event: APIGatewayEvent) => {
  let heartbeats = 0;
  const processor = ulid();

  const intervalNumber = setInterval(async () => {
    if (heartbeats++ >= maxBeats) {
      clearInterval(intervalNumber);
      return;
    }
    log.debug("Environment Worker heartbeat");
    await processEnvironment(processor);
  }, 1000);
};
