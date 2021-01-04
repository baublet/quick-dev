import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

export function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: number | string,
  props: (keyof EnvironmentCommand)[] | "*" = "*"
): Promise<EnvironmentCommand[]> {
  return trx<EnvironmentCommand>("environmentCommands")
    .select(props)
    .where("environmentId", "=", environmentId)
    .orderBy("created_at", "desc")
}
