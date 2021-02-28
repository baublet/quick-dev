import { Environment, EnvironmentCommand } from "../entities";
import { getDatabaseConnection } from "../db";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";

function safelyGetJson<T>(text: string): undefined | T {
  try {
    return JSON.parse(text);
  } catch (e) {
    log.error(`Error parsing command status response!`, {
      message: e.message,
      text,
    });
  }
}

export async function getEnvironmentCommandStatus(
  environment: Environment,
  environmentCommand: EnvironmentCommand
): Promise<void> {
  const db = getDatabaseConnection();
  if (!environment.ipv4) {
    log.warn(
      "Tried to check status of environment command for an environment that doesn't have an IP!",
      { environment }
    );
    return;
  }

  const response = await fetch(
    `http://${environment.ipv4}:8333/command/${environmentCommand.id}`,
    {
      method: "get",
      headers: {
        authorization: environment.secret,
      },
      timeoutMs: 1000,
    }
  );

  log.debug("Log response from environment", {
    environment,
    responseBodyFirst50: response.bodyText.substr(0, 50),
    status: response.status,
  });

  const responseJson = safelyGetJson<{
    started: boolean;
    isComplete: boolean;
    exitCode: undefined | number;
  }>(response.bodyText);

  if (!responseJson) {
    return;
  }

  if (!responseJson.started) {
    log.debug(
      `Expected command ID ${environmentCommand.id} to have started, but it's not!`
    );
    return;
  }

  if (responseJson.isComplete) {
    log.debug(`Command ${environmentCommand.id} not finished, yet`);
    return;
  }

  if (responseJson.exitCode === 0) {
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
}
