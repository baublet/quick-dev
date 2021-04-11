import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
  SSHKey,
  sshKey,
  Environment,
  EnvironmentCommand,
} from "../entities";
import { ConnectionOrTransaction, getDatabaseConnection } from "../db";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";
import { log } from "../../../common/logger";
import { sendCommand as sendCommandToEnvironment } from "../environmentPassthrough";

async function getData(
  db: ConnectionOrTransaction,
  environmentCommandId: string
) {
  const environmentCommand = await envCommandEntity.getByIdOrFail(
    db,
    environmentCommandId
  );
  const environment = await envEntity.getByIdOrFail(
    db,
    environmentCommand.environmentId
  );
  const environmentSshKey = await sshKey.getByUserOrFail(
    db,
    environment.user,
    environment.userSource
  );

  return {
    environmentCommand,
    environment,
    environmentSshKey,
  };
}

async function finalizeResults(
  db: ConnectionOrTransaction,
  environmentCommandId: string,
  results:
    | undefined
    | {
        error: string | false;
        buffer?: string | undefined;
        errorBuffer?: string | undefined;
        code?: number | undefined;
        signal?: string | undefined;
      }
) {
  const { environment, environmentCommand } = await getData(
    db,
    environmentCommandId
  );

  if (results === undefined) {
    log.error("Unknown error sending command to environment", {
      environment: environment.subdomain,
      command: environmentCommand.id,
    });
    throw new Error("Unknown error sending command to environment");
  }

  await envCommandEntity.update(db, environmentCommand.id, {
    logs: results.buffer,
  });

  const result = await environmentCommandStateMachine.setSuccess({
    trx: db,
    environment,
    environmentCommand,
  });

  if (result.operationSuccess === false) {
    log.error("Unknown error setting a command success", {
      result,
      environment: environment.name,
    });
  }
}

async function setupCommandToRun(
  db: ConnectionOrTransaction,
  environment: Environment,
  environmentCommand: EnvironmentCommand,
  environmentSshKey: SSHKey
) {
  const canContinue = await environmentCommandStateMachine.canSetRunning({
    trx: db,
    environment,
    environmentCommand,
    sshKey: environmentSshKey,
  });
  if (!canContinue.operationSuccess) {
    log.debug(
      "Unable to send command to environment. State machine forbids it",
      {
        canContinue,
        method: "setRunning",
        environmentCommand,
      }
    );
    return;
  }

  await environmentCommandStateMachine.setRunning({
    trx: db,
    environment,
    environmentCommand,
    sshKey: environmentSshKey,
  });
}

export const sendCommand = async (payload: {
  environmentCommandId: string;
}) => {
  const db = getDatabaseConnection();
  const preRunData = await getData(db, payload.environmentCommandId);

  if (
    preRunData.environment.deleted ||
    preRunData.environment.lifecycleStatus === "error_provisioning"
  ) {
    log.warn("sendCommand: skipping sending command to deleted environment", {
      environment: preRunData.environment.subdomain,
      commandFirst50: preRunData.environmentCommand.command.substring(0, 50),
    });
    return;
  }

  await setupCommandToRun(
    db,
    preRunData.environment,
    preRunData.environmentCommand,
    preRunData.environmentSshKey
  );

  const postRunData = await getData(db, payload.environmentCommandId);

  const results = await sendCommandToEnvironment(
    postRunData.environment,
    postRunData.environmentCommand,
    postRunData.environmentSshKey
  );

  await finalizeResults(db, payload.environmentCommandId, results);
};
