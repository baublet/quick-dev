import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getEnvironmentStartupLogs as getEnvironmentStartupLogsFromEnvironment } from "../environmentPassthrough";

export const checkEnvironmentCommandStatus = async (payload: {
  environmentCommandId: string;
}) => {
  const db = getDatabaseConnection();
  const environmentCommand = await envCommandEntity.getByIdOrFail(
    db,
    payload.environmentCommandId
  );
  const environment = await envEntity.getByIdOrFail(
    db,
    environmentCommand.environmentId
  );
  return db.transaction(async (trx) => {
    const startupLogs = await getEnvironmentStartupLogsFromEnvironment(
      environment
    );
    await envEntity.update(trx, environment.id, {
      startupLogs,
    });
  });
};
