import { Environment } from "../../entities";
import { Transaction } from "../../db";
import { environmentStateMachine } from "../../environmentStateMachine";
import { log } from "../../../../common/logger";

export async function processNewEnvironment(
  trx: Transaction,
  environment: Environment
) {
  try {
    const canCreate = await environmentStateMachine.canSetCreating({
      trx,
      environment,
    });
    if (!canCreate.operationSuccess) {
      log.error(
        "Environment ready to create, but blocked by the state machine!",
        { canCreate, environment }
      );
    }
    await environmentStateMachine.setCreating({ trx, environment });
  } catch (error) {
    log.error("Error creating an environment in the source!", {
      environment,
      message: error.message,
      stack: error.stack,
    });
  }
}
