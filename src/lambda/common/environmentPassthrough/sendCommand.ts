import fetch from "node-fetch";

import { Environment } from "../environment";
import { log } from "../../../common/logger";
import { EnvironmentCommand } from "../environmentCommand";

export async function sendCommand(
  environment: Environment,
  environmentCommand: EnvironmentCommand
) {
  if (!environment.ipv4) {
    log.error(
      "Environment prompted to receive a command, but has no IPv4 address",
      { environment, environmentCommand }
    );
    throw new Error("Environment is not ready for commands");
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/command/${environmentCommand.commandId}`,
    {
      method: "post",
      body: environmentCommand.command,
      headers: {
        "Content-Type": "text/plain",
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

  log.info("Environment received command OK", {
    environment,
    environmentCommand,
  });
}
