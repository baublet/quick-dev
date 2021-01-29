import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";
import { getNextCommandOrderByEnvironmentId } from "./getNextCommandOrderByEnvironmentId";

type CreateEnvironmentCommandInput = Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "environmentId" | "command" | "title" | "status">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
) {
  const nextOrder = await getNextCommandOrderByEnvironmentId(
    trx,
    input.environmentId
  );
  const created = await trx<EnvironmentCommand>("environmentCommands")
    .insert({
      ...input,
      id: ulid(),
      status: "waiting",
      order: nextOrder,
    })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
