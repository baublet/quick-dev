import { EnvironmentLock } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function del(trx: ConnectionOrTransaction, environmentId: string) {
  return trx<EnvironmentLock>("environmentLocks")
    .del()
    .where("environmentId", "=", environmentId);
}
