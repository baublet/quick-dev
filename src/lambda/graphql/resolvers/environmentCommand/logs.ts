import { Context } from "../../../common/context";
import {
  environment as envEntity,
  EnvironmentCommand,
} from "../../../common/entities";
import { EnvironmentCommandLogsNodeInput } from "../../generated";

export async function environmentCommandLogs(
  parent: EnvironmentCommand,
  { input }: { input: EnvironmentCommandLogsNodeInput },
  context: Context
): Promise<string | null> {
  const after = input?.after || 0;
  if (parent?.logs) {
    return parent.logs.substr(after);
  }

  const environment = await context
    .service(envEntity.loader)
    .load(parent.environmentId);

  if (parent.status === "ready") {
    return null;
  }

  if (parent.status === "cancelled") {
    return null;
  }

  if (!parent.logs) {
    return "";
  }
  return parent.logs.substring(0, after);
}
