import { log } from "../../../common/logger";
import { getById, del as deleteEnvironment } from "../../common/environment";
import {
  getByEnvironmentId,
  del as deleteEnvironmentDomainRecord,
} from "../../common/environmentDomainRecord";
import { ConnectionOrTransaction } from "../../common/db";
import { destroyEnvironment } from "../../common/environmentHandler/digitalOcean/destroyEnvironment";

export const deleteEnvironmentInProvider = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: number;
  }
) => {
  const environmentId = payload.environmentId;
  const [environment, environmentDomainRecords] = await Promise.all([
    getById(trx, environmentId),
    getByEnvironmentId(trx, environmentId),
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
    databaseOperations.push(deleteEnvironmentDomainRecord(trx, record.id))
  );
  await Promise.all(databaseOperations);
};
