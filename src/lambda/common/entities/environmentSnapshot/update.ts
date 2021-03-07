import { EnvironmentSnapshot } from "./index";
import { ConnectionOrTransaction } from "../../db";

type UpdateEnvironmentSnapshotInput = Partial<EnvironmentSnapshot>;

export async function update(
  trx: ConnectionOrTransaction,
  id: EnvironmentSnapshot["id"],
  input: UpdateEnvironmentSnapshotInput
): Promise<EnvironmentSnapshot> {
  const results = await trx<EnvironmentSnapshot>("environments")
    .update({ updated_at: trx.fn.now(), ...input })
    .where({ id })
    .limit(1)
    .returning("*");

  return results[0];
}
