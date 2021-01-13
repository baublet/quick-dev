import { Transaction } from "../db";
import { EnvironmentCommanderReturn } from ".";
import {
  Environment,
  environmentCommand as envCommandEntity,
  EnvironmentCommand,
} from "../entities";

export async function isComplete({
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
        "Environment cannot be finished provisioning if it's not currently provisioning",
      ],
      operationSuccess: false,
    };
  }

  const commands =
    environmentCommands ||
    (await (() => envCommandEntity.getByEnvironmentId(trx, environment.id))());

  if (commands.some((command) => command.status === "running")) {
    return {
      errors: ["Commands currently running"],
      operationSuccess: false,
    };
  }

  if (commands.some((command) => command.status === "waiting")) {
    return {
      errors: ["Commands left to process"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
