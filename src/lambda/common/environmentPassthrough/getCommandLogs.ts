import { Environment } from "../environment";
import { fetch } from "../fetch";

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
      expectStatus: 200,
      timeoutMs: 500,
    }
  );

  return response.bodyText;
}
