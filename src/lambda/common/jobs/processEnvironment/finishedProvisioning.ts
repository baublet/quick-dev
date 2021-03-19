import { Environment } from "../../entities";
import { Transaction } from "../../db";
import { environmentStateMachine } from "../../environmentStateMachine";
import { log } from "../../../../common/logger";

export async function processFinishedProvisioningEnvironment(
  trx: Transaction,
  environment: Environment
) {
  log.scream("TEST 1132");

  const isComplete = await environmentStateMachine.canSetReady({
    trx,
    environment,
  });

  if (isComplete.operationSuccess) {
    await environmentStateMachine.setReady({
      trx,
      environment,
    });
    return;
  }

  log.error(
    `NO OP! Environment is finished provisioning, but state machine doesn't allow us to set the environment to ready`,
    {
      stateMachineResults: isComplete,
      environment,
    }
  );
}
