require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import {
  EnvironmentCommand,
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "./common/entities";
import { environmentCommandStateMachine } from "./common/environmentCommandStateMachine";

// Called by a box when it's up and starts running our provisioning scripts
export const handler = async (event: APIGatewayEvent) => {
  const db = getDatabaseConnection();

  const secret = event.headers.authorization;
  const commandId = event?.queryStringParameters?.commandId;
  const status = event?.queryStringParameters
    ?.status as EnvironmentCommand["status"];

  if (!commandId) {
    log.error("EnvironmentCommandComplete did not receive a command ID", {
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
  const environment = await envEntity.getBySecret(db, secret);

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
  const environmentCommand = await envCommandEntity.getById(db, commandId);

  if (!environmentCommand) {
    log.error("EnvironmentCommandComplete could not find command ID", {
      commandId,
      environment: environment.name,
    });
    return {
      statusCode: 404,
    };
  }

  return db.transaction(async (trx) => {
    if (status === "success") {
      await environmentCommandStateMachine.setSuccess({
        trx,
        environment,
        environmentCommand,
      });
    } else {
      await environmentCommandStateMachine.setFailed({
        trx,
        environment,
        environmentCommand,
      });
    }

    return {
      statusCode: 200,
    };
  });
};
