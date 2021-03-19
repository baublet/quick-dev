import { environment as envEntity, sshKey } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getEnvironmentStartupLogs as getEnvironmentStartupLogsFromEnvironment } from "../environmentPassthrough";

export const getEnvironmentStartupLogs = async (payload: {
  environmentId: string;
}) => {
  const db = getDatabaseConnection();
  const environment = await envEntity.getByIdOrFail(db, payload.environmentId);

  const environmentSshKey = await sshKey.getByUserOrFail(
    db,
    environment.user,
    environment.userSource
  );

  const startupLogs = await getEnvironmentStartupLogsFromEnvironment(
    environment,
    environmentSshKey
  );
  await envEntity.update(db, environment.id, {
    startupLogs,
  });
};
