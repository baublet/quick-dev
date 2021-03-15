import {
  Environment,
  EnvironmentCommand,
  environmentCommand as environmentCommandEntity,
} from "../entities";
import { getDatabaseConnection } from "../db";
import { log } from "../../../common/logger";
import { fetch } from "../fetch";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";
import { enqueueJob } from "../enqueueJob";

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
) {
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

  log.debug("Status check response from environment", {
    environment: environment.subdomain,
    responseBodyLast50: response.bodyText.substr(-50),
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

  return responseJson;
}
