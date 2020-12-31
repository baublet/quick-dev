require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { getBySecret, update } from "./common/environment";

// Called by a box when it's up and starts running our provisioning scripts
export const handler = async (event: APIGatewayEvent) => {
  const body = JSON.parse(event.body);
  const db = getDatabaseConnection();
  const secret = event.headers.authorization;

  if (!secret) {
    log.error("EnvironmentReadyToProvision did not receive a secret");
    return {
      statusCode: 403,
    };
  }

  // Check if the environment exists
  const environment = await getBySecret(db, secret);

  if (!environment) {
    log.error(
      `EnvironmentReadyToProvision received invalid environment secret (not found)`,
      { secret }
    );
    return {
      statusCode: 404,
    };
  }

  // Make sure they're not in the wrong status for some reason
  if (environment.lifecycleStatus !== "creating") {
    log.error(
      `EnvironmentReadyToProvision request received for environment that's not in the proper status`,
      { environment }
    );
    return {
      statusCode: 400,
    };
  }

  // Update the environment in the database
  await update(db, environment.id, {
    lifecycleStatus: "provisioning",
  });

  log.debug("Updated environment to provisioning", { environment });

  return {
    statusCode: 200,
  };
};
