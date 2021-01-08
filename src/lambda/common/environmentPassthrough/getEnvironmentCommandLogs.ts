import fetch from "node-fetch";

import { Environment, update } from "../environment";
import { log } from "../../../common/logger";
import { EnvironmentCommand } from "../environmentCommand";

export async function getEnvironmentCommandLogs(
  environment: Environment,
  environmentCommand: EnvironmentCommand
): Promise<string> {
  if (!environment.ipv4) {
    return null;
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/command/${environmentCommand.commandId}`,
    {
      method: "get",
      headers: {
        authorization: environment.secret,
      },
    }
  );

  if(response.status === 404) {
    log.debug("Server has no log file yet. Command might not have produced output, yet");
    return ""
  }

  const body = await response.text();

  log.debug("Log response from environment", {
    environment,
    responseBodyFirst50: body.substr(0, 50),
    status: response.status,
  });

  return body;
}
