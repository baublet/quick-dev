import { log } from "../../../common/logger";
import { environmentDomainRecord, environment as env } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getExternalEnvironmentHandler } from "../../common/externalEnvironmentHandler";

export const deleteEnvironmentInProvider = async (payload: {
  environmentId: string;
}) => {
  return getDatabaseConnection().transaction(async (trx) => {
    const environmentId = payload.environmentId;
    const [environment, environmentDomainRecords] = await Promise.all([
      env.getById(trx, environmentId),
      environmentDomainRecord.getByEnvironmentId(trx, environmentId),
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
      getExternalEnvironmentHandler(environment).destroyEnvironment(
        environment,
        environmentDomainRecords
      ),
      ...environmentDomainRecords.map(async (record) => {
        await environmentDomainRecord.del(trx, record.id);
      }),
    ]);

    await env.update(trx, environmentId, { sourceId: "" });
  });
};
