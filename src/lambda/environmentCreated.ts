require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { enqueueJob } from "./common/enqueueJob";
import { environment as envEntity } from "./common/entities";

// Called by a box when it's up and starts running our provisioning scripts
export const handler = async (event: APIGatewayEvent) => {
  const body = JSON.parse(event.body || "{}");
  const ipv4 = body.ipv4;
  const db = getDatabaseConnection();
  const secret = event.headers.authorization;

  if (!secret) {
    log.error("EnvironmentCreated did not receive a secret");
    return {
      statusCode: 403,
    };
  }

  if (!ipv4) {
    log.error(`EnvironmentCreated received a malformed body`, body);
    return {
      statusCode: 400,
    };
  }

  // Check if the environment exists
  const environment = await envEntity.getBySecret(db, secret);

  if (!environment) {
    log.error(
      `EnvironmentCreated received invalid environment secret (not found)`,
      { secret }
    );
    return {
      statusCode: 404,
    };
  }

  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    log.error(
      `EnvironmentCreated request received for environment that's not in the proper status`,
      { environment }
    );
    return {
      statusCode: 400,
    };
  }

  // Update the environment in the database
  await envEntity.update(db, environment.id, {
    ipv4,
  });

  log.debug("Updated environment IP", { environment, ipv4 });

  return {
    statusCode: 200,
  };
};
