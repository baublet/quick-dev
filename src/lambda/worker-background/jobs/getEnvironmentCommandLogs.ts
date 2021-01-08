import { getByCommandId, update } from "../../common/environmentCommand";
import { getById } from "../../common/environment";

import { ConnectionOrTransaction } from "../../common/db";
import { getCommandLogs } from "../../common/environmentPassthrough";

export const getEnvironmentCommandLogs = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentCommandId: string;
  }
) => {
  const environmentCommandId = payload.environmentCommandId;

  const environmentCommand = await getByCommandId(trx, environmentCommandId);
  const environment = await getById(trx, environmentCommand.environmentId);

  const environmentCommandLogs = await getCommandLogs(
    environment,
    environmentCommandId
  );
  await update(trx, environmentCommandId, {
    logs: environmentCommandLogs,
  });
};
