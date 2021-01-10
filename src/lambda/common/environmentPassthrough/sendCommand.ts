import { Environment, EnvironmentCommand } from "../entities";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";

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

  await fetch(
    `http://${environment.ipv4}:8333/command/${environmentCommand.commandId}`,
    {
      method: "post",
      body: environmentCommand.command,
      headers: {
        "Content-Type": "text/plain",
        authorization: environment.secret,
      },
      expectStatus: 200,
      timeoutMs: 3000,
    }
  );

  log.info("Environment received command OK", {
    environment,
    environmentCommand,
  });
}
