import { Environment, update } from "../../../common/environment";
import { getEnvironmentStartupLogs } from "../../../common/environmentPassthrough";
import { Context } from "../../../common/context";
import {
  EnvironmentCommand,
  getByEnvironmentId,
} from "../../../common/environmentCommand";
import { log } from "../../../../common/logger";

export async function environmentLogs(
  parent: Environment,
  _args: unknown,
  context: Context
): Promise<
  | null
  | string
  | {
      startupLogs: () => Promise<string>;
      commands: () => Promise<EnvironmentCommand[]>;
    }
> {
  if (!parent.ipv4) {
    return null;
  }

  if (parent.startupLogs) {
    return parent.startupLogs;
  }

  const startupLogs = async () => {
    try {
      const logs = await getEnvironmentStartupLogs(parent);
      await update(context.db, parent.id, { startupLogs: logs });
    } catch (e) {
      return "";
    }
  };

  log.debug("Parent: ", { parent });

  return {
    startupLogs,
    commands: () => getByEnvironmentId(context.db, parent.id),
  };
}
