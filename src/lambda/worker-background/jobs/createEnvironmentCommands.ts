import { createMany } from "../../common/environmentCommand";
import { getById } from "../../common/environment";

import { Transaction } from "../../common/db";
import { log } from "../../../common/logger";
import { parseDefinition } from "../../common/strapYardFile";
import { createInitialCommands } from "../../common/environmentHandler/createInitialCommands";

export const createEnvironmentCommands = async (
  trx: Transaction,
  payload: {
    environmentId: string;
  }
) => {
  const environmentId = payload.environmentId;
  const environment = await getById(trx, environmentId);

  if (!environment) {
    log.error(
      "CreateEnvironmentCommands was sent an environment ID that doesn't exist",
      {
        environmentId,
      }
    );
    throw new Error(`Environment not found`);
  }

  await createInitialCommands(trx, { environment });

  const parsedFile = await parseDefinition(
    environment.repositoryUrl,
    environment.strapYardFile
  );
  const commandsToCreate = parsedFile.steps.map((step) => ({
    command: step.command,
    title: step.name || step.command,
  }));

  log.info("Creating commands from StrapYard file", {
    parsedFile,
    commandsToCreate,
  });

  const createdCommands = await createMany(
    trx,
    environment.id,
    commandsToCreate
  );

  log.debug("EnvironmentCommands created", { environment, createdCommands });
};
