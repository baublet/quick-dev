import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentCommandInput = Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "environmentId" | "command" | "title" | "status">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
): Promise<EnvironmentCommand> {
  const created = await trx<EnvironmentCommand>("environmentCommands")
    .insert({
      ...input,
      commandId: ulid(),
      status: "waiting",
    })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
