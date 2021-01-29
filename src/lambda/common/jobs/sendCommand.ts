import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { sendCommand as sendCommandToEnvironment } from "../environmentPassthrough";
import { Transaction } from "../db";

export const sendCommand = async (
  trx: Transaction,
  payload: {
    environmentCommandId: string;
  }
) => {
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

  await sendCommandToEnvironment(environment, environmentCommand);
};
