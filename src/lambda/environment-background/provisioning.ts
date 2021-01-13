import {
  environment as envEntity,
  Environment,
  environmentCommand as envCommandEntity,
} from "../common/entities";
import { Transaction } from "../common/db";
import { log } from "../../common/logger";
import { environmentCommander } from "../common/environmentCommander";

export async function processProvisioningEnvironment(
  trx: Transaction,
  environment: Environment
) {
  const commands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );

  const isComplete = await environmentCommander.isComplete({
    trx,
    environment,
    environmentCommands: commands,
  });

  if (!isComplete.operationSuccess) {
    // TODO: State machine needs to be used here
    await envEntity.update(trx, environment.id, {
      lifecycleStatus: "starting",
    });
    return;
  }

  const canSendNext = await environmentCommander.canSendNextCommand({
    trx,
    environment,
    environmentCommands: commands,
  });

  if (!canSendNext.operationSuccess) {
    log.debug(
      "The environment is provisioning, is not complete, yet cannot send commands. Environment command on this environment must be working",
      {
        environment,
      }
    );
    return;
  }

  const result = await environmentCommander.sendNextCommand({
    trx,
    environment,
  });

  if (!result.operationSuccess) {
    log.error("Unexpected error sending a command", {
      error: result.errors,
      environment,
    });
  }
}
