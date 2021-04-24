import { Environment, EnvironmentCommand, SSHKey } from "../entities";
import { log } from "../../../common/logger";
import { sendSshCommand } from "./sendSshCommand";

function getWorkingDirectory(environmentCommand: EnvironmentCommand): string {
  if (environmentCommand.workingDirectory) {
    return environmentCommand.workingDirectory;
  }

  return "~/project";
}

export async function sendCommand(
  environment: Environment,
  environmentCommand: EnvironmentCommand,
  sshKey: SSHKey
): Promise<undefined | ReturnType<typeof sendSshCommand>> {
  log.debug("Sending command to environment", {
    environment: environment.subdomain,
    ip: environment.ipv4,
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

  const workingDirectory = getWorkingDirectory(environmentCommand);

  const result = await sendSshCommand({
    ipv4: environment.ipv4,
    command: environmentCommand.command,
    workingDirectory,
    privateKey: sshKey.privateKey,
    timeoutInMs: 1000 * 60 * 30, // 30 minutes
    environmentCommandId: environmentCommand.id,
    environmentId: environment.id,
  });

  if (result.error || (result.code && result.code > 0)) {
    log.debug("Environment command received error", {
      environment: environment.subdomain,
      code: result.code,
      result: {
        logLast50: result.buffer?.substr(result.buffer?.length - 50),
      },
    });
  } else {
    log.debug("Environment received command OK", {
      environment: environment.subdomain,
      environmentCommand,
      result,
    });
  }

  return result;
}
