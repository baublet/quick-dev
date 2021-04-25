import {
  EnvironmentCommand,
  EnvironmentCommandLog,
} from "../../../common/entities";
import { EnvironmentCommandLogsNodeInput } from "../../generated";
import {
  buildConnectionResolver,
  Connection,
} from "../../common/buildConnectionResolver";
import { Context } from "../../../common/context";

export function environmentCommandLogs(
  parent: EnvironmentCommand,
  { input }: { input: EnvironmentCommandLogsNodeInput },
  context: Context
): Connection<EnvironmentCommandLog> {
  const query = context
    .db<EnvironmentCommandLog>("environmentCommandLogs")
    .where("environmentId", "=", parent.environmentId)
    .where("environmentCommandId", "=", parent.id);
  return buildConnectionResolver<EnvironmentCommandLog>(query, {
    first: input.first,
    after: input.after,
    sort: (q) => q.orderBy("id"),
  });
}
