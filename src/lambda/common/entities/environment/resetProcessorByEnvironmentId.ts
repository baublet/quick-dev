import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";
import { log } from "../../../../common/logger";

export async function resetProcessorByEnvironmentId(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<Environment> {
  log.debug("Resetting environment processor", {
    environmentId: id,
  });
  const results = await trx<Environment>("environments")
    .update({ processor: undefined, updated_at: trx.fn.now() })
    .where({ id })
    .whereNotNull("processor")
    .limit(1)
    .returning("*");
  return results[0];
}
