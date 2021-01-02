import { todo, jobFailed, jobComplete } from "../common/jobs";
import { getDatabaseConnection } from "../common/db";
import { JOB_MAP } from "./jobs";

const knownJobTypes = Object.keys(JOB_MAP);

export async function doAJob(processor: string): Promise<void> {
  const db = getDatabaseConnection();
  return db.transaction(async (trx) => {
    const jobToDo = await todo(trx, knownJobTypes, processor);
    const jobFn = JOB_MAP[jobToDo.type];

    if (!jobToDo) {
      return;
    }

    try {
      await jobFn(trx, jobToDo, jobToDo.payload as any);
      await jobComplete(trx, processor, jobToDo.id);
    } catch (e) {
      const message =
        `Job ${jobToDo.id} failed with:\n\n` + e.message + e.stack;
      await jobFailed(trx, processor, jobToDo.id, message);
    }
  });
}
