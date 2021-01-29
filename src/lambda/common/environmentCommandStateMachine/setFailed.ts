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

  // Here, we might only set subsequent jobs to cancelled conditionally when
  // we support that feature.
  const commands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );
  log.debug("Scanning through environment commands to close after one fails", {
    commands: commands.map((c) => ({ title: c.title, order: c.order })),
    updatedCommand: updatedCommand.title,
    originalEnvCommand: environmentCommand,
  });
  await Promise.all(
    commands.map((command) => {
      if (command.order <= updatedCommand.order) {
        // Don't update commands _prior_ to this one
        return;
      }
      if (command.status === "waiting") {
        log.debug("Cancelling command ", command);
        return envCommandEntity.update(trx, command.id, {
          status: "cancelled",
        });
      }
    })
  );

  await enqueueJob(trx, "getEnvironmentCommandLogs", {
    environmentCommandId: environmentCommand.id,
  });

  log.debug("Updated environment command to failed", {
    environment: environment.name,
    status: environment.lifecycleStatus,
    updatedCommand,
  });

  await envEntity.resetProcessorByEnvironmentId(trx, environment.id);

  return {
    errors: [],
    operationSuccess: true,
  };
}
