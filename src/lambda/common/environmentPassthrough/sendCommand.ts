import { Environment, EnvironmentCommand, SSHKey } from "../entities";
import { log } from "../../../common/logger";
import { sendSshCommand } from "./sendSshCommand";

export async function sendCommand(
  environment: Environment,
  environmentCommand: EnvironmentCommand,
  sshKey: SSHKey
): Promise<undefined | ReturnType<typeof sendSshCommand>> {
  log.debug("Sending command to environment", {
    environment: environment.name,
    environmentCommand: environmentCommand.command,
  });
  if (environment.deleted) {
    log.debug(
      `Environment prompted to send command, but environment is deleted. Skipping`,
      { environment: environment.subdomain }
    );
    return undefined;
  }

  if (!environment.ipv4) {
    log.error(
      "Environment prompted to receive a command, but has no IPv4 address",
      { environment, environmentCommand }
    );
    return undefined;
  }

  const result = await sendSshCommand({
    ipv4: environment.ipv4,
    command: environmentCommand.command,
    privateKey: sshKey.privateKey,
  });

  if (result.error) {
    log.debug("Environment command received error", {
      environment: environment.name,
      result,
    });
  } else {
    log.debug("Environment received command OK", {
      environment: environment.name,
      environmentCommand,
      result,
    });
  }

  return result;
}
