import fetch from "node-fetch";

import { Context } from "../context";
import { Environment, update } from "../environment";
import { log } from "../../../common/logger";

export async function getEnvironmentStartupLogs(
  environment: Environment,
  context?: Context
): Promise<string> {
  // If the startup logs exist on the environment, send those
  if (environment.startupLogs !== undefined) {
    return environment.startupLogs;
  }

  if (!environment.ipv4) {
    return null;
  }

  const response = await fetch(`http://${environment.ipv4}:8333/startupLogs`, {
    method: "get",
    headers: {
      authorization: environment.secret,
    },
  });

  const body = await response.text();

  log.debug("Log response from environment", {
    environment,
    responseBodyFirst50: body.substr(0, 50),
    status: response.status,
  });

  await update(context.db, environment.id, { startupLogs: body });

  return body;
}
