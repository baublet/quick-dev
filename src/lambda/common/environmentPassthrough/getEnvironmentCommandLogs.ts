import { Environment, EnvironmentCommand } from "../entities";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";

export async function getEnvironmentCommandLogs(
  environment: Environment,
  environmentCommand: EnvironmentCommand
): Promise<string> {
  if (!environment.ipv4) {
    log.warning(
      "Tried to get environment command logs for an environment that doesn't have an IP!",
      { environment, environmentCommand }
    );
    return null;
  }

  if (
    environmentCommand.status === "success" ||
    environmentCommand.status === "failed"
  ) {
    return environmentCommand.logs;
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/command/${environmentCommand.commandId}`,
    {
      method: "get",
      headers: {
        authorization: environment.secret,
      },
      expectStatus: 200,
      timeoutMs: 5000,
    }
  );

  log.debug("Log response from environment", {
    environment,
    responseBodyFirst50: response.bodyText.substr(0, 50),
    status: response.status,
  });

  return response.bodyText;
}
