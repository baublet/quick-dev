import { Job, IntermediateJob } from "./index";
import { Connection } from "../db";
import { log } from "../../../common/logger";

export async function todo(
  trx: Connection,
  knownJobTypes: string[],
  processor: string
): Promise<Job | undefined> {
  const found = await trx<IntermediateJob>("jobs")
    .select()
    .whereIn("type", knownJobTypes)
    .andWhere({
      status: "ready",
      processor: null,
    })
    .limit(1);

  if (found.length === 0) {
    return undefined;
  }

  const payload = JSON.parse(found[0].payload);
  const history = JSON.parse(found[0].history);
  const jobToDo = found[0];
  const updatedRows = await trx<Job>("jobs")
    .update({ status: "working", processor, updated_at: trx.fn.now() })
    .where({ id: jobToDo.id })
    .andWhere({ processor: null })
    .andWhere("status", "<>", "working")
    .limit(1);

  if (!updatedRows) {
    return undefined;
  }

  return {
    ...jobToDo,
    payload,
    history,
  };
}
