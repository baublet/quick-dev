import { ulid } from "ulid";

import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentCommandInput = (Partial<EnvironmentCommand> &
  Pick<EnvironmentCommand, "environmentId" | "command" | "title">)[];

export async function createMany(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
): Promise<EnvironmentCommand[]> {
  return trx<EnvironmentCommand>("environmentCommands")
    .insert(
      input.map((step) => ({
        status: "waiting",
        ...step,
        commandId: ulid(),
      }))
    )
    .returning("*");
}
