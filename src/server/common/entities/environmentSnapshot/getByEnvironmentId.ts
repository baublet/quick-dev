import { EnvironmentSnapshot } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: string,
  props: (keyof EnvironmentSnapshot)[] | "*" = "*"
): Promise<EnvironmentSnapshot[]> {
  return trx<EnvironmentSnapshot>("environmentSnapshots")
    .select(props)
    .where("environmentId", "=", environmentId)
    .where("deleted", "=", false);
}
