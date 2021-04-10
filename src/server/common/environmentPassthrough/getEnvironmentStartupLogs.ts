import { Environment, SSHKey } from "../entities";
import { log } from "../../../common/logger";

import { sendSshCommand } from "./sendSshCommand";

export async function getEnvironmentStartupLogs(
  environment: Environment,
  sshKey: SSHKey
): Promise<string | null> {
  if (!environment.ipv4) {
    log.warn(
      "Tried to get environment startup logs for an environment that doesn't have an IP!",
      { environment }
    );
    return null;
  }

  try {
    const result = await sendSshCommand({
      ipv4: environment.ipv4,
      command: "cat /var/log/cloud-init-output.log",
      privateKey: sshKey.privateKey,
      timeoutInMs: 5000,
    });

    if (result.error) {
      log.error("Error getting environment startup logs!", { result });
      return null;
    }

    return result.buffer || null;
  } catch (e) {
    log.error(
      `Error sending SSH command to ${environment.subdomain} (${environment.ipv4})`,
      {
        error: e.message,
      }
    );
    throw e;
  }
}
