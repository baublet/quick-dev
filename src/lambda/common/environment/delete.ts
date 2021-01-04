import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";
import { environmentDeleted } from "../environmentCommand";

export async function del(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  await environmentDeleted(trx, id);

  await trx<Environment>("environments")
    .update({ deleted: true, updated_at: trx.fn.now() })
    .where({ id })
    .limit(1);
  const freshRows = trx<Environment>("environments").select({ id }).limit(1);
  return freshRows[0];
}
