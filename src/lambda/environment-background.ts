require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";
import { ulid } from "ulid";

import { log } from "../common/logger";
import { processEnvironment } from "./environment-background/processEnvironment";

const maxBeats = 1;

export const handler = async (event: APIGatewayEvent) => {
  for (let i = 0; i < maxBeats; i++) {
    log.debug("Environment Worker heartbeat");
    await processEnvironment();
  }
};
