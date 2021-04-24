import { ConnectionOrTransaction } from "../../db";
import { EnvironmentCommandLog } from "./index";

export function getByEnvironmentCommandId(
  trx: ConnectionOrTransaction,
  environmentCommandId: string,
  props: (keyof EnvironmentCommandLog)[] | "*" = "*"
): Promise<EnvironmentCommandLog[]> {
  return trx<EnvironmentCommandLog>("environmentCommandLogs")
    .select(props)
    .where("environmentCommandId", "=", environmentCommandId);
}
