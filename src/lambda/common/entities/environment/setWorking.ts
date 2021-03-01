import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function setWorking(
  trx: ConnectionOrTransaction,
  id: Environment["id"]
): Promise<true> {
  const results = await trx<Environment>("environments")
    .update({ updated_at: trx.fn.now(), working: true })
    .where({ id, working: false })
    .limit(1);

  if (results > 0) {
    return true;
  }

  throw new Error(
    `Collision protection: can't set environment ${id} to working. It's already working.`
  );
}
