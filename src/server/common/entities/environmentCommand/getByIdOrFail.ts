import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getByIdOrFail(
  trx: ConnectionOrTransaction,
  commandId: string,
  props: (keyof EnvironmentCommand)[] | "*" = "*"
): Promise<EnvironmentCommand> {
  const found = await trx<EnvironmentCommand>("environmentCommands")
    .select(props)
    .where("id", "=", commandId)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  throw new Error(`Unable to find environment command with ID ${commandId}`);
}
