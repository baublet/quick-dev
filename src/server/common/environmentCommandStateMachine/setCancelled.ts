import { EnvironmentCommandStateMachineReturn } from ".";
import { ConnectionOrTransaction } from "../db";
import {
  Environment,
  EnvironmentCommand,
  environmentCommand as envCommandEntity,
} from "../entities";

interface SetCancelledArguments {
  trx: ConnectionOrTransaction;
  environment: Environment;
  environmentCommand: EnvironmentCommand;
}

const allowedFromStatuses: EnvironmentCommand["status"][] = [
  "ready",
  "running",
  "sending",
];

export async function canSetCancelled({
  environment,
  environmentCommand,
}: SetCancelledArguments): Promise<EnvironmentCommandStateMachineReturn> {
  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: ["Cannot start a command if the environment is not provisioning"],
      operationSuccess: false,
    };
  }

  if (!allowedFromStatuses.includes(environmentCommand.status)) {
    return {
      errors: [
        `Cannot cancel command if the command is not in status ${allowedFromStatuses.join(
          ", "
        )} (command is ${environmentCommand.status})`,
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}

export async function setCancelled({
  trx,
  environment,
  environmentCommand,
}: SetCancelledArguments): Promise<EnvironmentCommandStateMachineReturn> {
  const canContinue = await canSetCancelled({
    trx,
    environment,
    environmentCommand,
  });

  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  await envCommandEntity.update(trx, environmentCommand.id, {
    status: "cancelled",
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
