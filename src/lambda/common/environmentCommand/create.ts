import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentCommandInput = Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "environmentId" | "command" | "title" | "status">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
): Promise<EnvironmentCommand> {
  const createdIds = await trx<EnvironmentCommand>(
    "environmentCommands"
  ).insert({
    ...input,
    commandId: ulid(),
    status: "waiting",
  });
  const id = createdIds[0];
  const found = await trx<EnvironmentCommand>("environmentCommands")
    .select()
    .where("id", "=", id);
  return found[0];
}
