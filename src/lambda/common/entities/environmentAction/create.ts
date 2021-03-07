import { ulid } from "ulid";

import { EnvironmentAction } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function create(
  trx: ConnectionOrTransaction,
  payload: Partial<EnvironmentAction>
) {
  const result = await trx<EnvironmentAction>("environmentActions")
    .insert({
      id: ulid(),
      ...payload,
    })
    .returning("*");
  return result[0];
}
