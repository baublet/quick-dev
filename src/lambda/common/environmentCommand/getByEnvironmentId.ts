import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: number,
  props: (keyof EnvironmentCommand)[] | "*" = "*"
): Promise<EnvironmentCommand | undefined> {
  const found = await trx<EnvironmentCommand>("environmentCommands")
    .select(props)
    .where("environmentId", "=", environmentId)
    .andWhere("environmentDeleted", "=", false)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
