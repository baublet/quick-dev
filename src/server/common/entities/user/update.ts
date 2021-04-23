import { User } from "./index";
import { ConnectionOrTransaction } from "../../db";

type UpdateUserInput = Partial<User>;

export async function update(
  trx: ConnectionOrTransaction,
  id: User["id"],
  input: UpdateUserInput
): Promise<User> {
  const results = await trx<User>("users")
    .update({ updated_at: trx.fn.now(), ...input })
    .where({ id })
    .limit(1)
    .returning("*");

  return results[0];
}
