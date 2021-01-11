import { log } from "../../../common/logger";

import { environmentDomainRecord, environment as env } from "../entities";

import { ConnectionOrTransaction } from "../../common/db";
import { destroyEnvironment } from "../../common/externalEnvironmentHandler/digitalOcean/destroyEnvironment";

export const deleteEnvironmentInProvider = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
  }
) => {
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

  const databaseOperations: Promise<any>[] = [
    destroyEnvironment(environment, environmentDomainRecords),
  ];
  environmentDomainRecords.forEach((record) =>
    databaseOperations.push(environmentDomainRecord.del(trx, record.id))
  );
  await Promise.all(databaseOperations);
};
