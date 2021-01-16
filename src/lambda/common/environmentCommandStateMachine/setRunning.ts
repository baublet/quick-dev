import { EnvironmentCommandStateMachineReturn } from ".";
import { Transaction } from "../db";
import { enqueueJob } from "../enqueueJob";
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

export async function setRunning({
  trx,
  environment,
  environmentCommand,
}: SetRunningArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "waiting") {
    return {
      errors: [
        "Cannot start command if the command is not in the 'waiting' status",
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

  await envCommandEntity.update(trx, environmentCommand.id, {
    status: "running",
  });

  await enqueueJob(trx, "sendCommand", {
    environmentCommandId: environmentCommand.commandId,
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
