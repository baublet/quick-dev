import { log } from "../../../common/logger";
import { Transaction } from "../db";
import { EnvironmentCommand, Environment } from "../entities";
import { environmentCommandStateMachine } from "../environmentCommandStateMachine";
import { environmentStateMachine } from "../environmentStateMachine";

interface HandleCommandCompleteArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
  newStatus: EnvironmentCommand["status"];
}

// Called by a box when it's up and starts running our provisioning scripts
export const handleCommandComplete = async ({
  trx,
  environment,
  environmentCommand,
  newStatus,
}: HandleCommandCompleteArguments) => {
  if (newStatus === "failed") {
    const commandSetFailed = await environmentCommandStateMachine.setFailed({
      trx,
      environment,
      environmentCommand,
    });
    if (!commandSetFailed.operationSuccess) {
      log.error("handleCommandComplete failed unexpectedly", {
        commandSetFailed,
        environmentCommand,
      });
      throw new Error("handleCommandComplete failed unexpectedly");
    }
    const shouldSetFailed = await environmentStateMachine.canSetErrorProvisioning(
      { trx, environment }
    );
    if (shouldSetFailed.operationSuccess) {
      await environmentStateMachine.setErrorProvisioning({
        trx,
        environment,
      });
    }
    return;
  } else if (newStatus === "success") {
    await environmentCommandStateMachine.setSuccess({
      trx,
      environment,
      environmentCommand,
    });
    return;
  }

  log.error(
    `Unknown or invalid environment command status type when environment reports back a command status: ${newStatus}`,
    {
      environment,
      environmentCommand,
    }
  );
  throw new Error("Unknown or invalid command status type");
};
