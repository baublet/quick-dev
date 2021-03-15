import { Environment, EnvironmentCommand } from "../entities";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";

export async function getEnvironmentCommandLogs(
  environment: Environment,
  environmentCommand: EnvironmentCommand,
  after: number = 0
): Promise<string | null> {
  if (!environment.ipv4) {
    log.warn(
      "Tried to get environment command logs for an environment that doesn't have an IP!",
      { environment, environmentCommand }
    );
    return null;
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/logs/${environmentCommand.id}?after=${after}`,
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
    environment: environment.subdomain,
    responseBodyFirst50: response.bodyText.substr(0, 50),
    status: response.status,
  });

  return response.bodyText;
}
