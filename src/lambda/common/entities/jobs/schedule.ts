import { Job, IntermediateJob } from "./index";
import { Connection } from "../../db";

export async function schedule(
  trx: Connection,
  knownJobTypes: string[],
  processor: string
): Promise<Job | undefined> {
  const now = Date.now();

  const updatedRows = await trx<IntermediateJob>("jobs")
    .update({
      status: "ready",
      processor,
      updated_at: trx.fn.now(),
      pulse: now,
    })
    .andWhere((trx) =>
      trx
        .whereNull("processor")
        .where("status", "=", "waiting")
        .where("startAfter", "<=", now)
        .where("cancelAfter", ">=", now)
        .whereIn("type", knownJobTypes)
    )
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
