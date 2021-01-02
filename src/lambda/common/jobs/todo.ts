import { Job, IntermediateJob } from "./index";
import { Transaction } from "../db";

export async function todo(
  trx: Transaction,
  knownJobTypes: string[],
  processor: string
): Promise<Job | undefined> {
  const found = await trx<IntermediateJob>("jobs")
    .select()
    .whereIn("type", knownJobTypes)
    .andWhere({
      status: "ready",
    })
    .limit(1);

  if (found.length === 0) {
    return undefined;
  }

  const payload = JSON.parse(found[0].payload);
  const history = JSON.parse(found[0].history);
  const jobToDo = found[0];
  const updatedRows = await trx<Job>("jobs")
    .update({ status: "working", processor })
    .where({ id: jobToDo.id })
    .andWhere({ processor: null })
    .limit(1);

  if (!updatedRows) {
    return undefined;
  }
  trx.commit();

  return {
    ...jobToDo,
    payload,
    history,
  };
}
