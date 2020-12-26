import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

type UpdateEnvironmentInput = Partial<Environment>;

export async function update(
  trx: ConnectionOrTransaction,
  id: Environment["id"],
  input: UpdateEnvironmentInput
): Promise<Environment> {
  await trx<Environment>("environments").update(input).where({ id }).limit(1);
  const freshRows = trx<Environment>("environments").select({ id }).limit(1);
  return freshRows[0];
}
