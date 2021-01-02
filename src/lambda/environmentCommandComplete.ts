require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { getBySecret } from "./common/environment";
import {
  EnvironmentCommand,
  getByCommandId,
  update,
} from "./common/environmentCommand";

// Called by a box when it's up and starts running our provisioning scripts
export const handler = async (event: APIGatewayEvent) => {
  const db = getDatabaseConnection();
  const secret = event.headers.authorization;
  const commandId = event.queryStringParameters.commandId;
  const status = event.queryStringParameters
    .status as EnvironmentCommand["status"];

  if (!commandId) {
    log.error("EnvironmentCommandComplete did not receive a commandId", {
      queryStringParameters: event.queryStringParameters,
    });
    return {
      statusCode: 403,
    };
  }

  if (!secret) {
    log.error("EnvironmentCommandComplete did not receive a secret", {
      headers: event.headers,
    });
    return {
      statusCode: 403,
    };
  }

  // Check if the environment exists
  const environment = await getBySecret(db, secret);

  if (!environment) {
    log.error(
      "EnvironmentCommandComplete received invalid environment secret (not found)",
      { secret }
    );
    return {
      statusCode: 404,
    };
  }

  // Make sure the environment command exists
  const environmentCommand = await getByCommandId(db, commandId);

  if (!environmentCommand) {
    log.error("EnvironmentCommandComplete could not find command ID", {
      commandId,
      environment,
    });
    return {
      statusCode: 404,
    };
  }

  const statusToSet = status === "failure" ? "failure" : "success";
  const updatedCommand = await update(db, environmentCommand.id, {
    status: statusToSet,
  });
  log.debug("Updated environment command to " + statusToSet, {
    environment,
    status,
    statusToSet,
    updatedCommand,
  });

  return {
    statusCode: 200,
  };
};
