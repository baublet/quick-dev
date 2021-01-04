import { getByCommandId } from "../../common/environmentCommand";
import { getById } from "../../common/environment";

import { sendCommand as sendCommandToEnvironment } from "../../common/environmentPassthrough";
import { ConnectionOrTransaction } from "../../common/db";

export const sendCommand = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentCommandId: string;
  }
) => {
  const environmentCommandId = payload.environmentCommandId;
  const environmentCommand = await getByCommandId(trx, environmentCommandId);
  const environment = await getById(trx, environmentCommand.environmentId);

  await sendCommandToEnvironment(environment, environmentCommand);
};
