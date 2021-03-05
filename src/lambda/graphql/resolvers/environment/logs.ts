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
      startupLogs: string | null | (() => Promise<string | null>);
      commands: () => Promise<EnvironmentCommand[]>;
    }
> {
  if (!parent.ipv4) {
    return null;
  }

  return {
    startupLogs: parent.startupLogs || null,
    commands: () => envCommandEntity.getByEnvironmentId(context.db, parent.id),
  };
}
