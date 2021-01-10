import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";
import { getNextCommandOrderByEnvironmentId } from "./getNextCommandOrderByEnvironmentId";
import { log } from "../../../common/logger";

type CreateEnvironmentCommandInput = Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "environmentId" | "command" | "title" | "status">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
): Promise<EnvironmentCommand> {
  const nextOrder = await getNextCommandOrderByEnvironmentId(
    trx,
    input.environmentId
  );
  const created = await trx<EnvironmentCommand>("environmentCommands")
    .insert({
      ...input,
      id: ulid(),
      commandId: ulid(),
      status: "waiting",
      order: nextOrder,
    })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
