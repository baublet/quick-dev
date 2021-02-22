import { environmentCommand, environment as env } from "../entities";
import { getDatabaseConnection } from "../db";
import { log } from "../../../common/logger";
import { parseDefinition } from "../strapYardFile";
import { createInitialCommands } from "../externalEnvironmentHandler/createInitialCommands";

export const createEnvironmentCommands = async (payload: {
  environmentId: string;
}) => {
  return getDatabaseConnection().transaction(async (trx) => {
    const environmentId = payload.environmentId;
    const environment = await env.getById(trx, environmentId);

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

    const createdCommands = await environmentCommand.createMany(
      trx,
      environment.id,
      commandsToCreate
    );

    log.debug("EnvironmentCommands created", { environment, createdCommands });
  });
};
