import { EnvironmentCommand } from "../../../common/entities";
import { EnvironmentCommandLogsNodeInput } from "../../generated";

export async function environmentCommandLogs(
  parent: EnvironmentCommand,
  { input }: { input: EnvironmentCommandLogsNodeInput },
  context: unknown
): Promise<string | null> {
  const after = input?.after || 0;
  if (parent?.logs) {
    return parent.logs.substr(after);
  }
  return null;
}
