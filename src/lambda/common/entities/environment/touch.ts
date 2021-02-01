import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";
import { log } from "../../../../common/logger";

export async function touch(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  const results = await trx<Environment>("environments")
    .update({ updated_at: trx.fn.now() })
    .where({ id })
    .limit(1)
    .returning("*");
  return results[0];
}
