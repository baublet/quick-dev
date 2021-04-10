import { EnvironmentSnapshot } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function deleteByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: string
): Promise<void> {
  return trx<EnvironmentSnapshot>("environmentSnapshots").update({
    environmentId,
    deleted: true,
    deletedInProvider: true,
  });
}
