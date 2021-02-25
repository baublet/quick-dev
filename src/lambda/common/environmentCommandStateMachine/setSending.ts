import { EnvironmentCommandStateMachineReturn } from ".";
import { Transaction } from "../db";
import { enqueueJob } from "../enqueueJob";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
} from "../entities";
import { hasCommandInStatus } from "../hasCommandInStatus";

interface SetSendingArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
  environmentCommands: EnvironmentCommand[];
}

export async function canSetSending({
  trx,
  environment,
  environmentCommand,
  environmentCommands,
}: SetSendingArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "ready") {
    return {
      errors: [
        "Cannot send command if the command is not in the 'ready' status",
      ],
      operationSuccess: false,
    };
  }

  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: ["Cannot send a command if the environment is not provisioning"],
      operationSuccess: false,
    };
  }

  if (hasCommandInStatus(environmentCommands, "running")) {
    return {
      errors: ["One or more commands already running"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setSending({
  trx,
  environment,
  environmentCommand,
  environmentCommands,
}: SetSendingArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetSending({
    trx,
    environment,
    environmentCommand,
    environmentCommands,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  await enqueueJob(
    "sendCommand",
    {
      environmentCommandId: environmentCommand.id,
    },
    // It should take almost no time to ping the downstream server. If it takes
    // more than 30 seconds, it probably failed to send, so try again.
    { timeout: 30000 }
  );

  await envCommandEntity.update(trx, environmentCommand.id, {
    status: "sending",
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
