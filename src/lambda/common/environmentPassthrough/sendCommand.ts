import fetch from "node-fetch";

import { Environment } from "../environment";
import { log } from "../../../common/logger";
import { EnvironmentCommand } from "../environmentCommand";

export async function sendCommand(
  environment: Environment,
  environmentCommand: EnvironmentCommand
) {
  if (!environment.ipv4) {
    return null;
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/command/${environmentCommand.commandId}`,
    {
      method: "post",
      body: environmentCommand.command,
      headers: {
        authorization: environment.secret,
      },
    }
  );

  const body = await response.text();

  if (response.status !== 200) {
    log.error("Unknown error sending a command", {
      environment,
      environmentCommand,
      responseBodyFirst50: body.substr(0, 50),
      status: response.status,
    });
    throw new Error("Error sending command");
  }
}
