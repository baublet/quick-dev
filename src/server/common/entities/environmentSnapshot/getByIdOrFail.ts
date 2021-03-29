import { EnvironmentSnapshot } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getByIdOrFail(
  trx: ConnectionOrTransaction,
  id: string,
  props: (keyof EnvironmentSnapshot)[] | "*" = "*"
): Promise<EnvironmentSnapshot> {
  const found = await trx<EnvironmentSnapshot>("environmentSnapshots")
    .select(props)
    .where("id", "=", id)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }

  throw new Error(`Unable to find environment snapshot with ID: ${id}`);
}
