import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";
import { log } from "../../../../common/logger";

export async function resetProcessorByEnvironmentCommandId(
  trx: ConnectionOrTransaction,
  id: EnvironmentCommand["id"]
): Promise<EnvironmentCommand> {
  log.debug("Resetting environment processor", {
    environmentId: id,
  });
  const results = await trx<EnvironmentCommand>("environmentCommands")
    .update({ processor: undefined, updated_at: trx.fn.now() })
    .andWhere((trx) => {
      trx.where({ id });
      trx.whereNotNull("processor");
    })
    .limit(1)
    .returning("*");
  return results[0];
}
