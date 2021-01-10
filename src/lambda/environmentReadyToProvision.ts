require("./common/initialize");

import { APIGatewayEvent } from "aws-lambda";

import { log } from "../common/logger";
import { getDatabaseConnection } from "./common/db";
import { enqueueJob } from "./common/enqueueJob";
import { environment as envEntity } from "./common/entities";

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
  try {
    await db.transaction(async (trx) => {
      await enqueueJob(trx, "getEnvironmentStartupLogs", {
        environmentId: environment.id,
      });
      await envEntity.update(trx, environment.id, {
        lifecycleStatus: "provisioning",
      });
    });
  } catch (e) {
    log.error("Error sending initial command", {
      message: e.message,
      stack: e.stack,
    });
  }

  log.debug("Updated environment to provisioning", { environment });

  return {
    statusCode: 200,
  };
};
