import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";
import { Environment } from "../environment";

export async function environmentDeleted(
  trx: ConnectionOrTransaction,
  environmentId: Environment["id"]
): Promise<number> {
  return await trx<EnvironmentCommand>("environmentCommands")
    .update({ environmentDeleted: true })
    .where({ environmentId })
    .limit(1);
}
