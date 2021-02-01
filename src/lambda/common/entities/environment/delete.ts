import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function del(trx: ConnectionOrTransaction, id: Environment["id"]) {
  await trx<Environment>("environments")
    .update({ deleted: true, updated_at: trx.fn.now() })
    .where({ id })
    .limit(1);
  const freshRows = await trx<Environment>("environments")
    .select("*")
    .where("id", "=", id)
    .limit(1);
  return freshRows[0];
}
