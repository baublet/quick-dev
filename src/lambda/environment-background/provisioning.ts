import {
  Environment,
  environmentCommand as envCommandEntity,
  EnvironmentCommand,
} from "../common/entities";
import { Transaction } from "../common/db";
import { log } from "../../common/logger";
import { environmentStateMachine } from "../common/environmentStateMachine";
import { transitions } from "../common/environmentCommandStateMachine";

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
}): Promise<void> {
  const keys: (keyof typeof transitions)[] = Object.keys(transitions) as any;
  for (const status of keys) {
    const canTransition = await transitions[status].circuit({
      trx,
      environment,
      environmentCommands,
      environmentCommand,
    });
    if (canTransition.operationSuccess === true) {
      const result = await transitions[status].transition({
        trx,
        environment,
        environmentCommands,
        environmentCommand,
      });

      if (result.operationSuccess === true) {
        log.debug(
          `Successfully transitioned command ${environmentCommand.id} from ${environmentCommand.status} to ${status}`
        );
        return;
      } else {
        log.error(
          `Unknown error transitioning command ${environmentCommand.id} from ${environmentCommand.status} to ${status}`,
          {
            errors: result.errors,
          }
        );
        throw new Error(
          `Unknown error transitioning command ${environmentCommand.id} from ${environmentCommand.status} to ${status}`
        );
      }
    }
  }
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

  // Loop through the commands and advance their status if necessary
  const promises: Promise<any>[] = [];
  for (const command of environmentCommands) {
    promises.push(
      advanceIfPossible({
        trx,
        environment,
        environmentCommands,
        environmentCommand: command,
      })
    );
  }

  return Promise.all(promises).catch((error) => {
    log.error("Unknown error advancing environment commands!", {
      error,
      message: error.message,
    });
  });
}
