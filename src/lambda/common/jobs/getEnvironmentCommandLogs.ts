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

  const environmentCommand = await envCommandEntity.getById(
    trx,
    environmentCommandId
  );

  if (!environmentCommand) {
    throw new Error(
      `Job invariance violation! Expected environment with ID ${environmentCommandId} to exist. It does not`
    );
  }

  const environment = await envEntity.getById(
    trx,
    environmentCommand.environmentId
  );

  if (!environment) {
    throw new Error(
      `Job invariance violation! Expected environment command ${environmentCommandId} to be tied to an environment. Its environment cannot be found! (${environmentCommand.environmentId})`
    );
  }

  const environmentCommandLogs = await getCommandLogs(
    environment,
    environmentCommandId
  );

  if (environmentCommandLogs) {
    await envCommandEntity.update(trx, environmentCommand.id, {
      logs: environmentCommandLogs,
    });
  }
};
