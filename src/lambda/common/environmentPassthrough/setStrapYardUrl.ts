import { Environment } from "../entities";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";

export async function setStrapYardUrl(
  environment: Environment,
  newUrl: string
): Promise<void> {
  if (!environment.ipv4) {
    log.warn(
      "Tried to reset an environment strapYardUrl that doesn't have an IP!",
      {
        environment: environment.subdomain,
      }
    );
    return;
  }

  await fetch(`http://${environment.ipv4}:8333/setStrapYardUrl`, {
    method: "post",
    headers: {
      authorization: environment.secret,
    },
    expectStatus: 204,
    timeoutMs: 5000,
    body: newUrl,
  });
}
