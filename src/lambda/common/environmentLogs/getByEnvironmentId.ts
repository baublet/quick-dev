import { EnvironmentLog } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: number
): Promise<EnvironmentLog[]> {
  return await trx<EnvironmentLog>("environmentLogs")
    .select()
    .where({ environmentId });
}
