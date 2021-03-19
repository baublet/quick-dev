import { EnvironmentCommandStateMachineReturn } from ".";
import { ConnectionOrTransaction } from "../db";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
  SSHKey,
} from "../entities";
import { sendCommand } from "../environmentPassthrough";

interface SetRunningArguments {
  trx: ConnectionOrTransaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
  sshKey: SSHKey;
}

export async function canSetRunning({
  environment,
  environmentCommand,
}: SetRunningArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "sending") {
    return {
      errors: [
        `Cannot run command if the command is not in the 'sending' status. Status is ${environmentCommand.status}`,
      ],
      operationSuccess: false,
    };
  }

  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: ["Cannot start a command if the environment is not provisioning"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setRunning({
  trx,
  environment,
  environmentCommand,
  sshKey,
}: SetRunningArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetRunning({
    trx,
    environment,
    environmentCommand,
    sshKey,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  try {
    await envCommandEntity.update(trx, environmentCommand.id, {
      status: "running",
    });
    return {
      errors: [],
      operationSuccess: true,
    };
  } catch (e) {
    return {
      errors: [e.message, e.stack],
      operationSuccess: false,
    };
  }
}
