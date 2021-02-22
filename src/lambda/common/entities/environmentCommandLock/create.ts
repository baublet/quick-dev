import { EnvironmentCommandLock } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function create(
  trx: ConnectionOrTransaction,
  environmentCommandId: string
) {
  await trx<EnvironmentCommandLock>("environmentCommandLocks")
    .insert({ environmentCommandId })
    .returning("*");
}
