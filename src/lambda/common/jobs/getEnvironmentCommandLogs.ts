import {
  environmentCommand as envCommandEntity,
  environment as envEntity,
} from "../entities";
import { ConnectionOrTransaction } from "../db";
import { getCommandLogs } from "../environmentPassthrough";

export const getEnvironmentCommandLogs = async (
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

  const environmentCommandLogs = await getCommandLogs(
    environment,
    environmentCommandId
  );
  await envCommandEntity.update(trx, environmentCommand.id, {
    logs: environmentCommandLogs,
  });
};
