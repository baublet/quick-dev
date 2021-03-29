import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";

type UpdateEnvironmentCommandInput = Partial<EnvironmentCommand>;

export async function update(
  trx: ConnectionOrTransaction,
  id: EnvironmentCommand["id"],
  input: UpdateEnvironmentCommandInput
): Promise<EnvironmentCommand> {
  await trx<EnvironmentCommand>("environmentCommands")
    .update({
      updated_at: trx.fn.now(),
      ...input,
    })
    .where({ id })
    .limit(1);
  const freshRows = await trx<EnvironmentCommand>("environmentCommands")
    .select("*")
    .where({ id })
    .limit(1);
  return freshRows[0];
}
