import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getEnvironmentStartupLogs as getEnvironmentStartupLogsFromEnvironment } from "../environmentPassthrough";
import { log } from "../../../common/logger";

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
  if (environment.deleted) {
    log.debug(
      "Environment command status check cancelled. Environment is deleted",
      { environment: environment.subdomain }
    );
    return;
  }
  return db.transaction(async (trx) => {
    const startupLogs = await getEnvironmentStartupLogsFromEnvironment(
      environment
    );
    await envEntity.update(trx, environment.id, {
      startupLogs,
    });
  });
};
