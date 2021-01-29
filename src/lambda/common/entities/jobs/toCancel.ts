import { Job, IntermediateJob } from "./index";
import { Connection } from "../../db";

export async function toCancel(
  trx: Connection,
  processor: string
): Promise<Job | undefined> {
  const now = Date.now();

  const updatedRows = await trx<IntermediateJob>("jobs")
    .update({ status: "working", processor, updated_at: trx.fn.now() })
    .andWhere((trx) => {
      trx.where("status", "=", "working");
      trx.where("cancelAfter", "<=", now);
    })
    .limit(1)
    .returning("*");

  if (!updatedRows.length) {
    return undefined;
  }

  const found = updatedRows[0];
  const payload = JSON.parse(found.payload);
  const history = JSON.parse(found.history);

  return {
    ...found,
    payload,
    history,
  };
}
