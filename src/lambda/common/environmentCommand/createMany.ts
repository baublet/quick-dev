import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentCommandInput = (Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "environmentId" | "command" | "title" | "status">)[];

export async function createMany(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
): Promise<EnvironmentCommand[]> {
  const createdIds = await trx<EnvironmentCommand>(
    "environmentCommands"
  ).insert(
    input.map((step) => ({
      ...step,
      commandId: ulid(),
      status: "waiting",
    }))
  );
  const ids = createdIds;
  return trx<EnvironmentCommand>("environmentCommands")
    .select()
    .whereIn("id", ids);
}
