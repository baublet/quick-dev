import fetch from "node-fetch";

import { Environment } from "../environment";
import { log } from "../../../common/logger";

export async function getCommandLogs(
  environment: Environment,
  commandId: string,
  after: number = 0
): Promise<string> {
  if (!environment.ipv4) {
    return null;
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/logs/${commandId}?after=${{ after }}`,
    {
      method: "get",
      headers: {
        authorization: environment.secret,
      },
    }
  );

  const body = await response.text();

  if (response.status !== 200) {
    log.error("Unknown error sending a command", {
      commandId,
      environment,
      responseBodyFirst50: body.substr(0, 50),
      status: response.status,
    });
    throw new Error("Error getting command logs");
  }

  return body;
}
