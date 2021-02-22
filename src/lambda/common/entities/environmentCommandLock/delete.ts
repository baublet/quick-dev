import { EnvironmentCommandLock } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function del(
  trx: ConnectionOrTransaction,
  environmentCommandId: string
) {
  return trx<EnvironmentCommandLock>("environmentCommandLocks")
    .del()
    .where("environmentCommandId", "=", environmentCommandId);
}
