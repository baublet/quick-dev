import { EnvironmentCommanderReturn } from "..";
import { Transaction } from "../../db";
import { enqueueJob } from "../../enqueueJob";
import {
  Environment,
  environmentCommand as envCommandEntity,
} from "../../entities";
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

  const commandToRunNext = (() => {
    for (const command of commands) {
      if (command.status === "waiting") {
        return command;
      }
    }
  })();

  await enqueueJob(trx, "sendCommand", {
    environmentCommandId: commandToRunNext.commandId,
  });

  return {
    errors: [],
    operationSuccess: true,
  };
}
