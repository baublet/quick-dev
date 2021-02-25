import {
  environmentCommand as envCommandEntity,
  environment as envEntity,
  environmentLock,
  environmentCommandLock,
} from "../common/entities";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";
import { environmentCommandStateMachine } from "../common/environmentCommandStateMachine";
import { environmentStateMachine } from "../common/environmentStateMachine";

export async function processEnvironmentCommand() {
  const db = getDatabaseConnection();
  try {
    const environment = await envEntity.getProvisioningEnvironment(db);

    if (!environment) {
      return;
    }

    await environmentLock.create(db, environment.id);
    await envEntity.touch(db, environment.id);

    await db.transaction(async (trx) => {
      const environmentCommands = await envCommandEntity.getByEnvironmentId(
        db,
        environment.id
      );

      const hasCommandRunning = environmentCommands.some(
        (command) => command.status === "running"
      );
      if (hasCommandRunning) {
        return;
      }

      const hasCommandCancelled = environmentCommands.some(
        (command) => command.status === "cancelled"
      );
      if (hasCommandCancelled) {
        return;
      }

      const hasCommandFailed = environmentCommands.some(
        (command) => command.status === "failed"
      );
      if (hasCommandFailed) {
        return;
      }

      const hasCommandSending = environmentCommands.some(
        (command) => command.status === "sending"
      );
      if (hasCommandSending) {
        return;
      }

      const commandToSend = environmentCommands.find(
        (command) => command.status === "ready"
      );
      if (!commandToSend) {
        const {
          errors,
          operationSuccess,
        } = await environmentStateMachine.setFinishedProvisioning({
          environment,
          environmentCommands,
          trx,
        });
        if (!operationSuccess) {
          log.error(`Unknown error finishing provision`, errors);
        }
        return;
      }

      await environmentCommandStateMachine.setSending({
        trx,
        environment,
        environmentCommand: commandToSend,
        environmentCommands,
      });
    });
  } catch (e) {
    log.error(
      `Environment command processor threw an error while processing environment command`,
      {
        message: e.message,
        stack: e.stack,
      }
    );
    throw e;
  }
}
