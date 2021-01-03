import { log } from "../../../common/logger";
import { getById } from "../../common/environment";
import { ConnectionOrTransaction } from "../../common/db";
import { destroyEnvironment } from "../../common/environmentHandler/digitalOcean/destroyEnvironment";

export const deleteEnvironmentInProvider = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: number;
  }
) => {
  const environmentId = payload.environmentId;
  const environment = await getById(trx, environmentId);

  if (!environment) {
    log.error(
      "DeleteEnvironmentInProvider was send an environment ID that doesn't exist",
      {
        environmentId,
      }
    );
    throw new Error(`Environment not found`);
  }

  await destroyEnvironment(environment);
};
