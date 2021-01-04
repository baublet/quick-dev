import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

type UpdateEnvironmentCommandInput = Partial<EnvironmentCommand>;

export async function update(
  trx: ConnectionOrTransaction,
  id: EnvironmentCommand["id"],
  input: UpdateEnvironmentCommandInput
): Promise<EnvironmentCommand> {
  await trx<EnvironmentCommand>("environmentCommands")
    .update(input)
    .where({ id })
    .limit(1);
  const freshRows = trx<EnvironmentCommand>("environmentCommands")
    .select({ id })
    .limit(1);
  return freshRows[0];
}
