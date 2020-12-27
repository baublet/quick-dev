import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function resetEnvironmentId(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  await trx<Environment>("environments")
    .update({ processor: null })
    .where({ id })
    .whereNotNull("processor")
    .limit(1);
  const freshRows = trx<Environment>("environments").select({ id }).limit(1);
  return freshRows[0];
}
