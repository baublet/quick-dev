import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

export function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: string,
  props: (keyof EnvironmentCommand)[] | "*" = "*"
): Promise<EnvironmentCommand[]> {
  return trx<EnvironmentCommand>("environmentCommands")
    .select(props)
    .where("environmentId", "=", environmentId)
    .orderBy("order", "asc");
}
