import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

type UpdateEnvironmentInput = Partial<Environment>;

export async function update(
  trx: ConnectionOrTransaction,
  id: Environment["id"],
  input: UpdateEnvironmentInput
): Promise<Environment> {
  const results = await trx<Environment>("environments")
    .update({ updated_at: trx.fn.now(), ...input })
    .where({ id })
    .limit(1)
    .returning("*");

  return results[0];
}
