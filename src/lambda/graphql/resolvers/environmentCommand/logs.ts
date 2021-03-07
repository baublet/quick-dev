import { Context } from "../../../common/context";
import { enqueueJob } from "../../../common/enqueueJob";
import { EnvironmentCommand } from "../../../common/entities";
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

  if (parent.status === "ready") {
    return null;
  }

  if (parent.status === "cancelled") {
    return null;
  }

  await enqueueJob("getEnvironmentCommandLogs", {
    environmentCommandId: parent.id,
  });

  return "";
}
