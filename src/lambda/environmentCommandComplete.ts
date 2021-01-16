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
export const handler = (event: APIGatewayEvent) => {
  const db = getDatabaseConnection();

  return db.transaction(async (trx) => {
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
    const environmentCommand = await envCommandEntity.getByCommandId(
      db,
      commandId
    );

    if (!environmentCommand) {
      log.error("EnvironmentCommandComplete could not find command ID", {
        commandId,
        environment: environment.name,
      });
      return {
        statusCode: 404,
      };
    }

    if (status === "failed") {
      await environmentCommandStateMachine.setFailed({
        trx,
        environment,
        environmentCommand,
      });
    } else if (status === "success") {
      await environmentCommandStateMachine.setSuccess({
        trx,
        environment,
        environmentCommand,
      });
    } else {
      log.error(
        `Unknown or invalid environment command status type when environment reports back a command status: ${status}`,
        {
          environment,
          environmentCommand,
        }
      );
      return {
        statusCode: 422,
      };
    }

    return {
      statusCode: 200,
    };
  });
};
