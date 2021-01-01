import fetch from "node-fetch";

import { Context } from "../context";
import { Environment } from "../environment";
import { log } from "../../../common/logger";

export async function getEnvironmentStartupLogs(
  environment: Environment,
  context?: Context
): Promise<string> {
  if (context) {
    if (context.cache.environmentStartupLogsCache.has(environment.secret)) {
      log.debug("Cache hit for environment startup logs", { environment });
      return context.cache.environmentStartupLogsCache.get(environment.secret);
    }
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

  if (context) {
    context.cache.environmentStartupLogsCache.set(environment.secret, body);
  }

  return body;
}
