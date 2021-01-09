import { getById, update } from "../../common/environment";

import { ConnectionOrTransaction } from "../../common/db";
import { getEnvironmentStartupLogs as getEnvironmentStartupLogsFromEnvironment } from "../../common/environmentPassthrough";

export const getEnvironmentStartupLogs = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
  }
) => {
  const environment = await getById(trx, payload.environmentId);
  const startupLogs = await getEnvironmentStartupLogsFromEnvironment(
    environment
  );
  await update(trx, environment.id, {
    startupLogs,
  });
};
