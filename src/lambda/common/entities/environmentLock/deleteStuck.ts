import { EnvironmentLock } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function deleteStuck(trx: ConnectionOrTransaction) {
  return trx<EnvironmentLock>("environmentLocks")
    .del()
    .where("updated_at", "<=", new Date(Date.now() - 1000 * 60));
}
