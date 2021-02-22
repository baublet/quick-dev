import { EnvironmentLock } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function create(
  trx: ConnectionOrTransaction,
  environmentId: string
) {
  await trx<EnvironmentLock>("environmentLocks")
    .insert({ environmentId })
    .returning("*");
}
