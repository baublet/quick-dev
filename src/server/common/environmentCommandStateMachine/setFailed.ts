import { EnvironmentCommandStateMachineReturn } from ".";
import { log } from "../../../common/logger";
import { ConnectionOrTransaction } from "../db";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
} from "../entities";

interface SetFailedArguments {
  trx: ConnectionOrTransaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

export async function canSetFailed({
  environmentCommand,
}: SetFailedArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "running") {
    return {
      errors: ["Cannot set a command status to failed if it's not yet running"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setFailed({
  trx,
  environment,
  environmentCommand,
}: SetFailedArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetFailed({
    trx,
    environmentCommand,
    environment,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
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
  log.debug("Scanning through environment commands to close after one failed", {
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
      if (command.status === "ready") {
        log.debug("Cancelling command ", command);
        return envCommandEntity.update(trx, command.id, {
          status: "cancelled",
        });
      }
    })
  );

  log.debug("Updated environment command to failed", {
    environment: environment.subdomain,
    status: environment.lifecycleStatus,
    updatedCommand,
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
