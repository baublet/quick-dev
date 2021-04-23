import { ulid } from "ulid";

import { User } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function create(trx: ConnectionOrTransaction): Promise<User> {
  const created = await trx<User>("users")
    .insert({ id: ulid() })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
  throw new Error(
    `Unexpected error creating environment! DB invariance violation`
  );
}
