import { EnvironmentAction } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function deleteByEnvironmentId(
  trx: ConnectionOrTransaction,
  id: EnvironmentAction["id"]
) {
  await trx<EnvironmentAction>("environmentActions")
    .delete()
    .where("environmentId", "=", id);
}
