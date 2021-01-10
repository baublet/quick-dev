import { Environment } from "../entities";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";

export async function getEnvironmentStartupLogs(
  environment: Environment
): Promise<string> {
  // If the startup logs exist on the environment, send those
  if (typeof environment.startupLogs === "string") {
    return environment.startupLogs;
  }

  if (!environment.ipv4) {
    log.warning(
      "Tried to get environment startup logs for an environment that doesn't have an IP!",
      { environment }
    );
    return null;
  }

  const response = await fetch(`http://${environment.ipv4}:8333/startupLogs`, {
    method: "get",
    headers: {
      authorization: environment.secret,
    },
    expectStatus: 200,
    timeoutMs: 500,
  });

  log.debug("Log response from environment", {
    environment,
    responseBodyFirst50: response.bodyText.substr(0, 50),
    status: response.status,
  });

  return response.bodyText;
}
