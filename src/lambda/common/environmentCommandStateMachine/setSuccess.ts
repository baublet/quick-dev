import { EnvironmentCommandStateMachineReturn } from ".";
import { log } from "../../../common/logger";
import { Transaction } from "../db";
import { enqueueJob } from "../enqueueJob";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
  environmentLock,
} from "../entities";

interface SetSuccessArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

export async function canSetSuccess({
  environmentCommand,
}: SetSuccessArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "running") {
    return {
      errors: [
        "Cannot set a command status to success if it's not yet running",
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setSuccess({
  trx,
  environment,
  environmentCommand,
}: SetSuccessArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetSuccess({
    trx,
    environment,
    environmentCommand,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  const updatedCommand = await envCommandEntity.update(
    trx,
    environmentCommand.id,
    {
      status: "success",
    }
  );

  await enqueueJob("getEnvironmentCommandLogs", {
    environmentCommandId: environmentCommand.id,
  });

  log.debug("Updated environment command to complete", {
    environment: environment.name,
    status: environment.lifecycleStatus,
    updatedCommand,
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
