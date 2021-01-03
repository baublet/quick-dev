import { createMany } from "../../common/environmentCommand";
import { getById } from "../../common/environment";

import { ConnectionOrTransaction } from "../../common/db";
import { log } from "../../../common/logger";
import { parseDefinition } from "../../common/strapYardFile";

export const createEnvironmentCommands = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: number;
  }
) => {
  const environmentId = payload.environmentId;
  const environment = await getById(trx, environmentId);

  if (!environment) {
    log.error(
      "CreateEnvironmentCommands was send an environment ID that doesn't exist",
      {
        environmentId,
      }
    );
    throw new Error(`Environment not found`);
  }

  const parsedFile = await parseDefinition(
    environment.repositoryUrl,
    environment.strapYardFile
  );

  const createdCommands = await createMany(
    trx,
    parsedFile.steps.map((step) => ({
      environmentId: environment.id,
      command: step.run,
      title: step.name || step.run,
    }))
  );

  log.debug("EnvironmentCommands created", { environment, createdCommands });
};
