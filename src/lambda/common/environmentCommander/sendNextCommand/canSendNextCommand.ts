import { Transaction } from "knex";
import { EnvironmentCommanderReturn } from "..";
import {
  Environment,
  environmentCommand as envCommandEntity,
  EnvironmentCommand,
} from "../../entities";
import { hasCommandInStatus } from "../../hasCommandInStatus";

export async function canSendNextCommand({
  trx,
  environment,
  environmentCommands,
}: {
  trx: Transaction;
  environment: Environment;
  environmentCommands?: EnvironmentCommand[];
}): Promise<EnvironmentCommanderReturn> {
  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: [
        "Environment cannot be sent commands if they're not provisioning",
      ],
      operationSuccess: false,
    };
  }

  const commands =
    environmentCommands ||
    (await (() => envCommandEntity.getByEnvironmentId(trx, environment.id))());

  if (hasCommandInStatus(commands, "running")) {
    return {
      errors: ["One or more commands already running"],
      operationSuccess: false,
    };
  }

  if (!hasCommandInStatus(commands, "waiting")) {
    return {
      errors: ["No commands left waiting to be sent"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
