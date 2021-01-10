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
      startupLogs: string | (() => Promise<string>);
      commands: () => Promise<EnvironmentCommand[]>;
    }
> {
  if (!parent.ipv4) {
    return null;
  }

  const startupLogs = async () => {
    try {
      const logs = await getEnvironmentStartupLogs(parent);
      console.log("------------------------------------------------", logs);
      await update(context.db, parent.id, { startupLogs: logs });
      return logs;
    } catch (e) {
      return "";
    }
  };

  return {
    startupLogs: parent.startupLogs || startupLogs,
    commands: () => getByEnvironmentId(context.db, parent.id),
  };
}
