import { Environment, EnvironmentLifecycleStatus } from "./index";
import { Connection } from "../../db";
import { log } from "../../../../common/logger";

const processorStatusesThatNeedWork: EnvironmentLifecycleStatus[] = [
  "new",
  "provisioning",
];

export async function getEnvironmentThatNeedsWork(
  db: Connection,
  input: {
    currentProcessor: string;
  }
) {
  const updatedRows = await db<Environment>("environments")
    .update({ processor: input.currentProcessor, updated_at: db.fn.now() })
    .andWhere((b) => {
      b.where("deleted", "=", false);
      b.whereIn("lifecycleStatus", processorStatusesThatNeedWork);
      b.whereNull("processor");
    })
    .limit(1)
    .returning("*");

  if (updatedRows.length > 0) {
    return updatedRows[0];
  }

  log.debug("getEnvironmentThatNeedsWork: no environment needs work");
}
