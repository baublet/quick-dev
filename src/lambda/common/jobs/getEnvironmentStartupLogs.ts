import { environment as envEntity } from "../entities";
import { ConnectionOrTransaction } from "../../common/db";
import { getEnvironmentStartupLogs as getEnvironmentStartupLogsFromEnvironment } from "../environmentPassthrough";

export const getEnvironmentStartupLogs = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
  }
) => {
  const environment = await envEntity.getById(trx, payload.environmentId);
  const startupLogs = await getEnvironmentStartupLogsFromEnvironment(
    environment
  );
  await envEntity.update(trx, environment.id, {
    startupLogs,
  });
};
