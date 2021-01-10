import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { sendCommand as sendCommandToEnvironment } from "../environmentPassthrough";
import { ConnectionOrTransaction } from "../db";

export const sendCommand = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentCommandId: string;
  }
) => {
  const environmentCommandId = payload.environmentCommandId;
  const environmentCommand = await envCommandEntity.getByCommandId(
    trx,
    environmentCommandId
  );
  const environment = await envEntity.getById(
    trx,
    environmentCommand.environmentId
  );

  await sendCommandToEnvironment(environment, environmentCommand);
};
