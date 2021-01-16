import { Context } from "../../../common/context";
import { getCommandLogs } from "../../../common/environmentPassthrough";
import { log } from "../../../../common/logger";
import {
  environment as envEntity,
  Environment,
  EnvironmentCommand,
} from "../../../common/entities";

async function safelyGetData(
  environment: Environment,
  commandId: string,
  after: number
): Promise<string> {
  try {
    return await getCommandLogs(environment, commandId, after);
  } catch (e) {
    log.error(
      "Error getting command data. Sending through a blank string, but FIX THIS!",
      {
        environment,
        commandId,
        after,
        error: {
          message: e.message,
          stack: e.stack,
        },
      }
    );
    return "";
  }
}

export async function environmentCommandLogs(
  parent: EnvironmentCommand,
  { after = 0 }: { after?: number },
  context: Context
): Promise<string | null> {
  if (parent.logs) {
    return parent.logs.substr(after);
  }

  const environment = await context
    .service(envEntity.loader)
    .load(parent.environmentId);

  if (parent.status === "waiting") {
    return null;
  }

  if (parent.status === "cancelled") {
    return null;
  }

  if (parent.logs) {
    return parent.logs;
  }

  const data = await safelyGetData(environment, parent.commandId, after);

  return data;
}
