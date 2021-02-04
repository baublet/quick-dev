require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";
import { ulid } from "ulid";

import { log } from "../common/logger";
import { processEnvironmentCommand } from "./environmentCommand-background/processEnvironmentCommand";

const maxBeats = 1;

export const handler = async (event: APIGatewayEvent) => {
  const processor = ulid();

  for (let i = 0; i < maxBeats; i++) {
    log.debug("Environment Command Worker heartbeat");
    await processEnvironmentCommand(processor);
  }
};
