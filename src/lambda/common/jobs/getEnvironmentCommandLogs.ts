import {
  environmentCommand as envCommandEntity,
  environment as envEntity,
} from "../entities";
import { getDatabaseConnection } from "../db";
import { getEnvironmentCommandLogs as getCommandLogs } from "../environmentPassthrough";

export const getEnvironmentCommandLogs = async (payload: {
  environmentCommandId: string;
}) => {
  return getDatabaseConnection().transaction(async (trx) => {
    const environmentCommandId = payload.environmentCommandId;

    const environmentCommand = await envCommandEntity.getByIdOrFail(
      trx,
      environmentCommandId
    );
    const environment = await envEntity.getByIdOrFail(
      trx,
      environmentCommand.environmentId
    );

    if (environment.deleted) {
      return;
    }

    const environmentCommandLogs = await getCommandLogs(
      environment,
      environmentCommand,
      environmentCommand.logs?.length
    );

    if (environmentCommandLogs) {
      await envCommandEntity.appendLog(
        trx,
        environmentCommand.id,
        environmentCommandLogs
      );
    }
  });
};
