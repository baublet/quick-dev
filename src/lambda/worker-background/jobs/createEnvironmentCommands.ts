import { createMany } from "../../common/environmentCommand";
import { getById } from "../../common/environment";

import { ConnectionOrTransaction } from "../../common/db";
import { log } from "../../../common/logger";
import { parseDefinition } from "../../common/strapYardFile";

export const createEnvironmentCommands = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
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
  const commandsToCreate = parsedFile.steps.map((step) => ({
    environmentId: environment.id,
    command: step.command,
    title: step.name || step.command,
  }));

  log.info("Creating commands from StrapYard file", {
    parsedFile,
    commandsToCreate,
  });

  const createdCommands = await createMany(trx, commandsToCreate);

  log.debug("EnvironmentCommands created", { environment, createdCommands });
};
