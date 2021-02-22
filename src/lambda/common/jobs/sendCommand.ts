import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { sendCommand as sendCommandToEnvironment } from "../environmentPassthrough";
import { getDatabaseConnection } from "../db";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";
import { log } from "../../../common/logger";

export const sendCommand = async (payload: {
  environmentCommandId: string;
}) => {
  return getDatabaseConnection().transaction(async (trx) => {
    const environmentCommandId = payload.environmentCommandId;
    const environmentCommand = await envCommandEntity.getById(
      trx,
      environmentCommandId
    );

    if (!environmentCommand) {
      throw new Error(
        `Job invariance error! Asked to send command ID ${environmentCommandId}, but no command with that ID exists!`
      );
    }

    const environment = await envEntity.getById(
      trx,
      environmentCommand.environmentId
    );

    if (!environment) {
      throw new Error(
        `Job invariance error! Environment command ${environmentCommandId} has no environment?!`
      );
    }

    const canContinue = await environmentCommandStateMachine.setRunning({
      trx,
      environment,
      environmentCommand,
    });
    if (!canContinue.operationSuccess) {
      log.error(
        "Unable to sent command to environment. State machine forbade it",
        {
          canContinue,
          method: "setRunning",
          environmentCommand,
        }
      );
      throw new Error(
        `Unable to send the command to running state! Errors: ${canContinue.errors}`
      );
    }

    await sendCommandToEnvironment(environment, environmentCommand);
    await environmentCommandStateMachine.setRunning({
      trx,
      environment,
      environmentCommand,
    });
  });
};
