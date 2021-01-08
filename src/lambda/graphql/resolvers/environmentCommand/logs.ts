import { Context } from "../../../common/context";
import { EnvironmentCommand } from "../../../common/environmentCommand";
import { EnvironmentCommandLog } from "../../generated";
import { getCommandLogs } from "../../../common/environmentPassthrough";
import { loader } from "../../../common/environment";

export async function environmentCommandLogs(
  parent: EnvironmentCommand,
  { after }: { after: number },
  context: Context
): Promise<EnvironmentCommandLog[]> {
  const environment = await context.service(loader).load(parent.environmentId);
  const logs = await getCommandLogs(environment, parent.commandId, after);

  return [
    {
      id: after,
      logs,
    },
  ];
}
