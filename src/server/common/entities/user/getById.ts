import { User } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getById(
  trx: ConnectionOrTransaction,
  id: string,
  props: (keyof User)[] | "*" = "*"
): Promise<User | undefined> {
  const found = await trx<User>("users")
    .select(props)
    .where("id", "=", id)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
