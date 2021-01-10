import { Context } from "../../../common/context";
import { Environment } from "../../../common/environment";
import { EnvironmentCommand } from "../../../common/environmentCommand";
import { EnvironmentCommandLog } from "../../generated";
import { getCommandLogs } from "../../../common/environmentPassthrough";
import { loader } from "../../../common/environment";
import { log } from "../../../../common/logger";

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

export async function environmentCommandLogChunks(
  parent: EnvironmentCommand,
  { after = 0 }: { after?: number },
  context: Context
): Promise<EnvironmentCommandLog[]> {
  const id = `${parent.id}-${after}`;

  if (parent.logs) {
    return [{ id, data: parent.logs.substr(after) }];
  }

  const environment = await context.service(loader).load(parent.environmentId);
  const data = await safelyGetData(environment, parent.commandId, after);

  return [
    {
      id,
      data,
    },
  ];
}
