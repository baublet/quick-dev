import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function del(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  await trx<Environment>("environments")
    .update({ deleted: true, updated_at: trx.fn.now() })
    .where({ id })
    .limit(1);
  const freshRows = trx<Environment>("environments").select({ id }).limit(1);
  return freshRows[0];
}
