require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { environment as envEntity } from "./common/entities";
import { environmentStateMachine } from "./common/environmentStateMachine";

// Called by a box when it's up and starts running our provisioning scripts
export const handler = async (event: APIGatewayEvent) => {
  const db = getDatabaseConnection();
  const secret = event.headers.authorization;

  if (!secret) {
    log.error("EnvironmentReadyToProvision did not receive a secret");
    return {
      statusCode: 403,
    };
  }

  // Check if the environment exists
  const environment = await envEntity.getBySecret(db, secret);

  if (!environment) {
    log.error(
      `EnvironmentReadyToProvision received invalid environment secret (not found)`,
      { secret }
    );
    return {
      statusCode: 404,
    };
  }

  const result = await db.transaction((trx) => {
    return environmentStateMachine.setProvisioning({
      trx,
      environment,
    });
  });

  if (!result.operationSuccess) {
    log.warn("Tried to set an environment as provisioning, but failed!", {
      environment: environment.name,
      errors: result.errors,
    });
    return {
      statusCode: 500,
    };
  }

  return {
    statusCode: 200,
  };
};
