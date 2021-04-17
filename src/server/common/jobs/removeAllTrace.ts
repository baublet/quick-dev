import { log } from "../../../common/logger";
import { environmentDomainRecord, environment as env } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getExternalEnvironmentHandler } from "../../common/externalEnvironmentHandler";

export const removeAllTrace = async (payload: { environmentId: string }) => {
  const db = getDatabaseConnection();
  const environmentId = payload.environmentId;
  const [environment, environmentDomainRecords] = await Promise.all([
    env.getById(db, environmentId),
    environmentDomainRecord.getByEnvironmentId(db, environmentId),
  ]);

  if (!environment) {
    log.error(
      "DeleteEnvironmentInProvider was sent an environment ID that doesn't exist",
      {
        environmentId,
      }
    );
    throw new Error(`Environment not found`);
  }

  await Promise.all([
    getExternalEnvironmentHandler(environment).removeAllTrace(environment),
    getExternalEnvironmentHandler(environment).destroyEnvironment(
      environment,
      environmentDomainRecords
    ),
    ...environmentDomainRecords.map(async (record) => {
      await environmentDomainRecord.del(db, record.id);
    }),
  ]);
};
