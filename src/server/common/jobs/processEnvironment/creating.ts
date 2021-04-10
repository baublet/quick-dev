import { Environment, environment as envEntity } from "../../entities";
import { Transaction } from "../../db";
import { environmentStateMachine } from "../../environmentStateMachine";
import { log } from "../../../../common/logger";

export async function processCreatingEnvironment(
  trx: Transaction,
  environment: Environment
) {
  await envEntity.touch(trx, environment.id);
  // If the environment has no source ID, something went wrong with spinning up
  // the environment in the external provider. This is a big error, so move the
  // environment to failed...
  if (!environment.sourceId) {
    await environmentStateMachine.setErrorProvisioning({
      trx,
      environment,
    });
    return;
  }

  try {
    const canProvision = await environmentStateMachine.canSetProvisioning({
      trx,
      environment,
    });
    if (!canProvision.operationSuccess) {
      log.debug(
        "Environment not yet ready to create: blocked by the state machine!",
        { canProvision, environment }
      );
    }
    await environmentStateMachine.setProvisioning({ trx, environment });
  } catch (error) {
    log.error("Error creating an environment in the source!", {
      environment: environment.subdomain,
      message: error.message,
      stack: error.stack,
    });
  }
}
