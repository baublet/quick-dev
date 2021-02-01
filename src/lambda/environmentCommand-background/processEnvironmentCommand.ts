import {
  environmentCommand as envCommandEntity,
  environment as envEntity,
} from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";
import { environmentCommandStateMachine } from "../common/environmentCommandStateMachine";

export async function processEnvironment(currentProcessor: string) {
  const db = getDatabaseConnection();
  try {
    const environmentCommand = await envCommandEntity.getEnvironmentCommandThatNeedsWork(
      db,
      {
        currentProcessor,
      }
    );
    if (!environmentCommand) {
      log.debug(
        "processEnvironmentCommand.ts: No environment commands need processing..."
      );
      return;
    }
    await db.transaction(async (trx) => {
      const environmentCommands = await envCommandEntity.getByEnvironmentId(
        trx,
        environmentCommand.environmentId
      );
      const environment = await envEntity.getById(
        trx,
        environmentCommand.environmentId
      );

      if (!environment) {
        throw new Error(
          `Environment command invariance violation! Expected environment with ID ${environmentCommand.id} to exist. It did not.`
        );
      }

      const result = await environmentCommandStateMachine.setSending({
        trx,
        environment,
        environmentCommand,
        environmentCommands,
      });

      if (!result.operationSuccess) {
        throw new Error(
          `Error sending an environment command! ${JSON.stringify(
            result.errors
          )}`
        );
      }
    });
  } catch (e) {
    log.error(
      `Environment command processor ${currentProcessor} threw an error while processing environment command`,
      {
        message: e.message,
        stack: e.stack,
      }
    );
    throw e;
  }
}
