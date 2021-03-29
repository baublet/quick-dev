import { EnvironmentAction } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: EnvironmentAction["environmentId"]
): Promise<EnvironmentAction | undefined> {
  const result = await trx<EnvironmentAction>("environmentActions")
    .select("*")
    .where("environmentId", "=", environmentId);
  return result[0];
}
