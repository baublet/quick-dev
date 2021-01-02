import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../db";

type UpdateEnvironmentCommandInput = Partial<EnvironmentCommand>;

export async function update(
  trx: ConnectionOrTransaction,
  id: EnvironmentCommand["id"],
  input: UpdateEnvironmentCommandInput
): Promise<EnvironmentCommand> {
  await trx<EnvironmentCommand>("environmentCommand")
    .update(input)
    .where({ id })
    .limit(1);
  const freshRows = trx<EnvironmentCommand>("environmentCommand")
    .select({ id })
    .limit(1);
  return freshRows[0];
}
