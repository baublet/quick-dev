import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getByIdOrFail(
  trx: ConnectionOrTransaction,
  id: string,
  props: (keyof Environment)[] | "*" = "*"
): Promise<Environment> {
  const found = await trx<Environment>("environments")
    .select(props)
    .where("id", "=", id)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }

  throw new Error(`Unable to find environment with ID: ${id}`);
}
