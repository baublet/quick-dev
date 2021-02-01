import { EnvironmentCommandStateMachineReturn } from ".";
import { Transaction } from "../db";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
} from "../entities";

interface SetRunningArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

export async function canSetRunning({
  environment,
  environmentCommand,
}: SetRunningArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "sending") {
    return {
      errors: [
        "Cannot run command if the command is not in the 'sending' status",
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
}: SetRunningArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetRunning({
    trx,
    environment,
    environmentCommand,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  await envCommandEntity.update(trx, environmentCommand.id, {
    status: "running",
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
