import {
  Environment,
  environmentCommand as envCommandEntity,
  environmentCommand,
  EnvironmentCommand,
} from "../../entities";
import { Transaction } from "../../db";
import { environmentStateMachine } from "../../environmentStateMachine";
import {
  environmentCommandStateMachine,
  transitions,
} from "../../environmentCommandStateMachine";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";

function isFinalStatus(status: EnvironmentCommand["status"]) {
  return ([
    "cancelled",
    "failed",
    "success",
  ] as EnvironmentCommand["status"][]).includes(status);
}

function anotherCommandIsRunning(environmentCommands: EnvironmentCommand[]) {
  return environmentCommands.some((command) => command.status === "running");
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

  if (anotherCommandIsRunning(environmentCommands)) {
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
    }

    return true;
  }

  return false;
}

export async function processProvisioningEnvironment(
  trx: Transaction,
  environment: Environment
) {
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
    log.scream("Environment provisioning is complete", { isComplete });
    await environmentStateMachine.setFinishedProvisioning({
      trx,
      environment,
      environmentCommands,
    });
    return;
  }

  try {
    // Loop through the commands and advance their status if possible
    for (const command of environmentCommands) {
      const result = await advanceIfPossible({
        trx,
        environment,
        environmentCommands,
        environmentCommand: command,
      });
      if (result) break;
    }
  } catch (error) {
    log.error("Unknown error advancing environment commands!", {
      error,
      message: error.message,
    });
  }
}
