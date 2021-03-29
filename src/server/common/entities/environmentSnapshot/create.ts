import { ulid } from "ulid";

import { EnvironmentSnapshot } from "./index";
import { ConnectionOrTransaction } from "../../db";

type CreateEnvironmentInput = Partial<EnvironmentSnapshot> &
  Pick<EnvironmentSnapshot, "environmentId">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentInput
): Promise<EnvironmentSnapshot> {
  const created = await trx<EnvironmentSnapshot>("environmentSnapshots")
    .insert({ ...input, id: ulid() })
    .returning("*");
  return created[0];
}
