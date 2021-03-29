import { EnvironmentAction } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function update(
  trx: ConnectionOrTransaction,
  payload: Partial<EnvironmentAction> & { id: string }
) {
  const result = await trx<EnvironmentAction>("environmentActions")
    .update({
      ...payload,
    })
    .where("id", "=", payload.id)
    .limit(1)
    .returning("*");
  return result[0];
}
