import { EnvironmentCommanderReturn } from "..";
import { Transaction } from "../../db";
import {
  Environment,
  environmentCommand as envCommandEntity,
} from "../../entities";
import { environmentCommandStateMachine } from "../../environmentCommandStateMachine";
import { canSendNextCommand } from "./canSendNextCommand";

export async function sendNextCommand({
  trx,
  environment,
}: {
  trx: Transaction;
  environment: Environment;
}): Promise<EnvironmentCommanderReturn> {
  const commands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );

  const canContinue = await canSendNextCommand({
    trx,
    environment,
    environmentCommands: commands,
  });

  if (!canContinue.operationSuccess) {
    return {
      errors: canContinue.errors,
      operationSuccess: true,
    };
  }

  // This will always return a result if `canSendNextCommand` is true
  const commandToRunNext = (() => {
    for (const command of commands) {
      if (command.status === "waiting") {
        return command;
      }
    }
  })() as envCommandEntity.EnvironmentCommand;

  await environmentCommandStateMachine.setRunning({
    trx,
    environment,
    environmentCommand: commandToRunNext,
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
