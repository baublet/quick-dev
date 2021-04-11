import {
  environmentCommandStateMachine,
  EnvironmentCommandStateMachineReturn,
} from ".";
import { log } from "../../../common/logger";
import { ConnectionOrTransaction } from "../db";
import { enqueueJob } from "../enqueueJob";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
} from "../entities";
import { hasCommandInStatus } from "../hasCommandInStatus";

interface SetSendingArguments {
  trx: ConnectionOrTransaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
  environmentCommands: EnvironmentCommand[];
}

export async function canSetSending({
  trx,
  environment,
  environmentCommand,
}: SetSendingArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environmentCommand.status !== "ready") {
    return {
      errors: [
        "Cannot send command if the command is not in the 'ready' status",
      ],
      operationSuccess: false,
    };
  }

  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: ["Cannot send a command if the environment is not provisioning"],
      operationSuccess: false,
    };
  }

  const environmentCommands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );

  if (hasCommandInStatus(environmentCommands, "running")) {
    return {
      errors: ["One or more commands already running"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setSending({
  trx,
  environment,
  environmentCommand,
  environmentCommands,
}: SetSendingArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetSending({
    trx,
    environment,
    environmentCommand,
    environmentCommands,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  await envCommandEntity.update(trx, environmentCommand.id, {
    status: "sending",
  });

  await enqueueJob(
    "sendCommand",
    { environmentCommandId: environmentCommand.id },
    {
      timeout: 1000 * 60 * 30,
      retries: 3,
      onRetry: async () => {
        log.scream("Retrying command", { environmentCommand });
      },
      onFail: async () => {
        const result = await environmentCommandStateMachine.setFailed({
          trx,
          environment,
          environmentCommand,
        });

        if (result.operationSuccess === false) {
          log.error("Unknown error setting a command as failed", {
            result,
            environment: environment.name,
          });
        }
        return;
      },
    }
  );

  return {
    errors: [],
    operationSuccess: true,
  };
}
