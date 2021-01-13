import { EnvironmentCommandStateMachineReturn } from ".";
import { log } from "../../../common/logger";
import { Transaction } from "../db";
import { enqueueJob } from "../enqueueJob";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
  environment as envEntity,
} from "../entities";

interface SetFailedArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

export async function setFailed({
  trx,
  environment,
  environmentCommand,
}: SetFailedArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "running") {
    return {
      errors: ["Cannot set a command status to failed if it's not yet running"],
      operationSuccess: false,
    };
  }

  const updatedCommand = await envCommandEntity.update(
    trx,
    environmentCommand.id,
    {
      status: "failed",
    }
  );

  await enqueueJob(trx, "getEnvironmentCommandLogs", {
    environmentCommandId: environmentCommand.commandId,
  });

  log.debug("Updated environment command to failed", {
    environment,
    status,
    updatedCommand,
  });

  log.debug(
    "Command complete: resetting processor for environment ID",
    environment.id
  );
  await envEntity.resetProcessorByEnvironmentId(trx, environment.id);

  return {
    errors: [],
    operationSuccess: true,
  };
}
