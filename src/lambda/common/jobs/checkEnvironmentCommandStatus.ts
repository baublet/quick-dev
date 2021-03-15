import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../entities";
import { getDatabaseConnection } from "../../common/db";
import {
  getEnvironmentCommandStatus,
  getEnvironmentCommandLogs,
} from "../environmentPassthrough";
import { log } from "../../../common/logger";
import { enqueueJob } from "../enqueueJob";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";

export const checkEnvironmentCommandStatus = async (payload: {
  environmentCommandId: string;
}) => {
  const db = getDatabaseConnection();
  const environmentCommand = await envCommandEntity.getByIdOrFail(
    db,
    payload.environmentCommandId
  );
  const environment = await envEntity.getByIdOrFail(
    db,
    environmentCommand.environmentId
  );
  if (environment.deleted) {
    log.debug(
      "Environment command status check cancelled. Environment is deleted",
      { environment: environment.subdomain }
    );
    return;
  }
  return db.transaction(async (trx) => {
    if (!environment.ipv4) {
      log.warn(
        "Tried to check status of environment command for an environment that doesn't have an IP!",
        { environment }
      );
      return;
    }

    const status = await getEnvironmentCommandStatus(
      environment,
      environmentCommand
    );

    log.debug("checkEnvironmentCommandStatus return from environment", {
      status,
      environment: environment.subdomain,
    });

    if (!status?.started) {
      log.error(
        `Expected command ID ${environmentCommand.id} to have started, but it's not!`
      );
      return;
    }

    await enqueueJob("getEnvironmentCommandLogs", {
      environmentCommandId: environmentCommand.id,
    });

    if (!status.isComplete) {
      return;
    }

    if (status.exitCode === 0) {
      log.debug(`Command ${environmentCommand.id} success! Updating...`);
      await db.transaction((trx) => {
        return environmentCommandStateMachine.setSuccess({
          trx,
          environment,
          environmentCommand,
        });
      });
    } else {
      log.debug(`Command ${environmentCommand.id} has failed... ruh oh`);
      await db.transaction((trx) => {
        return environmentCommandStateMachine.setFailed({
          trx,
          environment,
          environmentCommand,
        });
      });
    }
  });
};
