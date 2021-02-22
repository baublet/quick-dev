import { environment as envEntity } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getEnvironmentStartupLogs as getEnvironmentStartupLogsFromEnvironment } from "../environmentPassthrough";

export const getEnvironmentStartupLogs = async (payload: {
  environmentId: string;
}) => {
  return getDatabaseConnection().transaction(async (trx) => {
    const environment = await envEntity.getById(trx, payload.environmentId);

    if (!environment) {
      throw new Error(
        `getEnvironmentStartupLogs invariance error! Environment doesn't exist in the DB: ${payload.environmentId}`
      );
    }

    const startupLogs = await getEnvironmentStartupLogsFromEnvironment(
      environment
    );
    await envEntity.update(trx, environment.id, {
      startupLogs,
    });
  });
};
