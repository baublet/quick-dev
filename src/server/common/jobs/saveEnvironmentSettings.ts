import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
  SSHKey,
  sshKey,
  Environment,
  EnvironmentCommand,
} from "../entities";
import { ConnectionOrTransaction, getDatabaseConnection } from "../db";
import { log } from "../../../common/logger";
import { sendRawCommand as sendCommandToEnvironment } from "../environmentPassthrough";

function isError(code: number | undefined): boolean {
  if (!code) return false;
  return code > 0;
}

async function getData(db: ConnectionOrTransaction, environmentId: string) {
  const environment = await envEntity.getByIdOrFail(db, environmentId);
  const environmentSshKey = await sshKey.getByUserOrFail(
    db,
    environment.userId
  );

  return {
    environment,
    environmentSshKey,
  };
}

export const sendCommand = async (payload: {
  environmentCommandId: string;
  command: string;
}) => {
  const db = getDatabaseConnection();
  const { environment, environmentSshKey } = await getData(
    db,
    payload.environmentCommandId
  );

  if (
    environment.deleted ||
    environment.lifecycleStatus === "error_provisioning"
  ) {
    log.warn(
      "saveEnvironmentSettings: skipping sending command to deleted environment",
      {
        environment: environment.subdomain,
        commandFirst50: payload.command,
      }
    );
    return;
  }

  const results = await sendCommandToEnvironment(
    environment,
    environmentSshKey,
    `rm -rf ~/.strapyard.tar.gz; tar -czvf ~/.strapyard.tar.gz /root/.local/share/code-server`
  );
};
