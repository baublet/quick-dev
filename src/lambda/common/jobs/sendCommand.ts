import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
  Environment,
  EnvironmentCommand,
} from "../entities";
import { sendCommand as sendCommandToEnvironment } from "../environmentPassthrough";
import { getDatabaseConnection } from "../db";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";
import { log } from "../../../common/logger";

export const sendCommand = async (payload: {
  environmentCommandId: string;
}) => {
  let foundEnvironment: Environment | undefined;
  let foundEnvironmentCommand: EnvironmentCommand | undefined;

  await getDatabaseConnection().transaction(async (trx) => {
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

    if (environment.deleted) {
      log.debug(
        `Environment attempted to end command, but environment is deleted. Skipping`,
        { environment: environment.subdomain }
      );
      return;
    }

    const canContinue = await environmentCommandStateMachine.canSetRunning({
      trx,
      environment,
      environmentCommand,
    });
    if (!canContinue.operationSuccess) {
      log.debug(
        "Unable to send command to environment. State machine forbids it",
        {
          canContinue,
          method: "setRunning",
          environmentCommand,
        }
      );
      return;
    }

    await environmentCommandStateMachine.setRunning({
      trx,
      environment,
      environmentCommand,
    });

    foundEnvironment = environment;
    foundEnvironmentCommand = environmentCommand;
  });

  if (!foundEnvironment || !foundEnvironmentCommand) {
    // no op
    return;
  }

  await sendCommandToEnvironment(foundEnvironment, foundEnvironmentCommand);
};
