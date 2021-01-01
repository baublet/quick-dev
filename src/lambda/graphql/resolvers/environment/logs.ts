import { Environment } from "../../../common/environment";
import { getEnvironmentStartupLogs } from "../../../common/environmentPassthrough";
import { Context } from "../../../common/context";

export async function environmentLogs(
  parent: Environment,
  _args: unknown,
  context: Context
): Promise<null | {
  startupLogs: Promise<string>;
}> {
  if (!parent.ipv4) {
    return null;
  }
  return { startupLogs: getEnvironmentStartupLogs(parent, context) };
}
