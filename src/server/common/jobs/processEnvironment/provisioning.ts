import {
  Environment,
  environmentCommand as envCommandEntity,
  EnvironmentCommand,
  environment as envEntity,
} from "../../entities";
import { Transaction } from "../../db";
import { environmentStateMachine } from "../../environmentStateMachine";
import { environmentCommandStateMachine } from "../../environmentCommandStateMachine";
import { log } from "../../../../common/logger";

function isFinalStatus(status: EnvironmentCommand["status"]) {
  return ([
    "cancelled",
    "failed",
    "success",
  ] as EnvironmentCommand["status"][]).includes(status);
}

function anyCommandIsRunning(environmentCommands: EnvironmentCommand[]) {
  return environmentCommands.find((command) => command.status === "running");
}

function commandTimedOut(environmentCommand: EnvironmentCommand): boolean {
  const timeout =
    environmentCommand.updated_at.getMilliseconds() + 1000 * 60 * 5;
  return Date.now() >= timeout;
}

// Returns true if we did work, and need to stop advancing through commands
async function advanceIfPossible({
  trx,
  environmentCommand,
  environmentCommands,
  environment,
}: {
  trx: Transaction;
  environmentCommand: EnvironmentCommand;
  environmentCommands: EnvironmentCommand[];
  environment: Environment;
}): Promise<boolean> {
  if (isFinalStatus(environmentCommand.status)) {
    return false;
  }

  const runningCommand = anyCommandIsRunning(environmentCommands);
  if (runningCommand) {
    if (commandTimedOut(runningCommand)) {
      const result = await environmentCommandStateMachine.setCancelled({
        trx,
        environment,
        environmentCommand,
      });
      if (!result.operationSuccess) {
        log.error("Unable to set command to cancelled (TIMEOUT)", {
          result,
          environmentCommand,
        });
        return false;
      }
      return true;
    }
    return true;
  }

  if (environmentCommand.status === "sending") {
    // Here, we're waiting for the job to send the command, and the environment
    // to ping our endpoint that tells us it got the command
    return true;
  }

  if (environmentCommand.status === "ready") {
    const result = await environmentCommandStateMachine.setSending({
      trx,
      environment,
      environmentCommand,
      environmentCommands,
    });

    if (!result.operationSuccess) {
      log.error("Unable to set command to sending!", {
        result,
        environmentCommand,
        environmentCommands,
      });
      return false;
    }

    return true;
  }

  return false;
}

export async function processProvisioningEnvironment(
  trx: Transaction,
  environment: Environment
) {
  await envEntity.touch(trx, environment.id);
  const environmentCommands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );

  const isComplete = await environmentStateMachine.canSetFinishedProvisioning({
    trx,
    environment,
    environmentCommands,
  });

  if (isComplete.operationSuccess) {
    log.debug("Environment provisioning is complete", { isComplete });
    await environmentStateMachine.setFinishedProvisioning({
      trx,
      environment,
      environmentCommands,
    });
    return;
  }

  if (environmentCommands.some((command) => command.status === "cancelled")) {
    log.debug("Environment provisioning is cancelled", {
      environment: environment.subdomain,
    });
    const result = await environmentStateMachine.setErrorProvisioning({
      trx,
      environment,
    });
    if (!result.operationSuccess) {
      log.error("Unknown error setting environment to provisioning", {
        result,
        environment: environment.subdomain,
      });
    }
    return;
  }

  try {
    // Loop through the commands and advance their status if possible
    for (const command of environmentCommands) {
      const done = await advanceIfPossible({
        trx,
        environment,
        environmentCommands,
        environmentCommand: command,
      });
      if (done) break;
    }
  } catch (error) {
    log.error("Unknown error advancing environment commands!", {
      error,
      message: error.message,
    });
  }
}
