import {
  EnvironmentCommand,
  EnvironmentCommandLog,
} from "../../../common/entities";
import { EnvironmentCommandLogsNodeInput } from "../../generated";
import {
  buildConnectionResolver,
  Connection,
} from "../../../common/buildConnectionResolver";
import { Context } from "../../../common/context";

export function environmentCommandLogs(
  parent: EnvironmentCommand,
  { input: incomingInput }: { input: EnvironmentCommandLogsNodeInput },
  context: Context
): Promise<Connection<EnvironmentCommandLog>> {
  const input = incomingInput || {};
  const query = context
    .db<EnvironmentCommandLog>("environmentCommandLogs")
    .where("environmentId", "=", parent.environmentId)
    .where("environmentCommandId", "=", parent.id);
  return buildConnectionResolver<EnvironmentCommandLog>(query, {
    first: input.first,
    after: input.after,
    before: input.before,
    last: input.last,
    sort: {
      id: "asc",
    },
  });
}
