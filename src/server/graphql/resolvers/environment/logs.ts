import {
  environmentCommand as envCommandEntity,
  Environment,
  EnvironmentCommand,
} from "../../../common/entities";
import { Context } from "../../../common/context";

export async function environmentLogs(
  parent: Environment,
  _args: unknown,
  context: Context
): Promise<
  | null
  | string
  | {
      commands: () => Promise<EnvironmentCommand[]>;
    }
> {
  return {
    commands: () => envCommandEntity.getByEnvironmentId(context.db, parent.id),
  };
}
