import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";
import { sendCommand as sendCommandToEnvironment } from "../environmentPassthrough";
import { Transaction } from "../db";
import { log } from "../../../common/logger";

export const sendCommand = async (
  trx: Transaction,
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
