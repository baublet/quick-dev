import { Environment } from "../entities";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";

export async function setSecret(
  environment: Environment,
  newSecret: string
): Promise<void> {
  if (!environment.ipv4) {
    log.warn("Tried to reset an environment secret that doesn't have an IP!", {
      environment: environment.subdomain,
    });
    return;
  }

  await fetch(`http://${environment.ipv4}:8333/setSecret`, {
    method: "post",
    headers: {
      authorization: environment.secret,
    },
    expectStatus: 204,
    timeoutMs: 5000,
    body: newSecret,
  });
}
