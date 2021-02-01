import { EnvironmentCommandStateMachineReturn } from ".";
import { Transaction } from "../db";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
} from "../entities";

interface SetReadyArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

export async function canSetReady({
  trx,
  environment,
  environmentCommand,
}: SetReadyArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "waiting") {
    return {
      errors: [
        "Cannot ready command if the command is not in the 'waiting' status",
      ],
      operationSuccess: false,
    };
  }

  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: ["Cannot ready a command if the environment is not provisioning"],
      operationSuccess: false,
    };
  }

  // Only allow this if the commands before this one are "success"
  const environmentCommands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );
  for (const command of environmentCommands) {
    if (command.id === environmentCommand.id) {
      break;
    }
    if (command.status === "failed" || command.status === "cancelled") {
      return {
        errors: [
          "Cannot ready a command if a command before it failed or was cancelled",
        ],
        operationSuccess: false,
      };
    }
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setReady({
  trx,
  environment,
  environmentCommand,
}: SetReadyArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetReady({
    trx,
    environment,
    environmentCommand,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  await envCommandEntity.update(trx, environmentCommand.id, {
    status: "ready",
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
