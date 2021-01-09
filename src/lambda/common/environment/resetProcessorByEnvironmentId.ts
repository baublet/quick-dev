import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function resetProcessorByEnvironmentId(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  const results = await trx<Environment>("environments")
    .update({ processor: null, updated_at: trx.fn.now() })
    .where({ id })
    .whereNotNull("processor")
    .limit(1)
    .returning("*");
  return results[0];
}
