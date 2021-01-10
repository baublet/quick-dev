import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";
import { getNextCommandOrderByEnvironmentId } from "./getNextCommandOrderByEnvironmentId";
import { log } from "../../../common/logger";

type CreateEnvironmentCommandInput = (Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "command" | "title">)[];

export async function createMany(
  trx: ConnectionOrTransaction,
  environmentId: string,
  input: CreateEnvironmentCommandInput
): Promise<EnvironmentCommand[]> {
  let nextOrder = await getNextCommandOrderByEnvironmentId(trx, environmentId);
  return trx<EnvironmentCommand>("environmentCommands")
    .insert(
      input.map((step) => ({
        status: "waiting",
        ...step,
        id: ulid(),
        commandId: ulid(),
        environmentId,
        order: (nextOrder += 100),
      }))
    )
    .returning("*");
}
