import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
  Environment,
  EnvironmentCommand,
} from "../../../common/entities";
import { getEnvironmentStartupLogs } from "../../../common/environmentPassthrough";
import { Context } from "../../../common/context";

export async function environmentLogs(
  parent: Environment,
  _args: unknown,
  context: Context
): Promise<
  | null
  | string
  | {
      startupLogs: string | (() => Promise<string | null>);
      commands: () => Promise<EnvironmentCommand[]>;
    }
> {
  if (!parent.ipv4) {
    return null;
  }

  const startupLogs = async () => {
    try {
      const logs = await getEnvironmentStartupLogs(parent);
      await envEntity.update(context.db, parent.id, { startupLogs: logs });
      return logs;
    } catch (e) {
      return "";
    }
  };

  return {
    startupLogs: parent.startupLogs || startupLogs,
    commands: () => envCommandEntity.getByEnvironmentId(context.db, parent.id),
  };
}
