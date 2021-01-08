import { Environment, EnvironmentLifecycleStatus } from "./index";
import { Connection } from "../db";
import { log } from "../../../common/logger";

const processorStatusesThatNeedWork: EnvironmentLifecycleStatus[] = [
  "new",
  "provisioning",
];

export async function getEnvironmentThatNeedsWork(
  db: Connection,
  input: {
    currentProcessor: string;
  }
): Promise<Environment | null> {
  // Grab an environment that needs work
  const found = await db<Environment>("environments")
    .select()
    .andWhere((q) => q.whereNull("processor"))
    .andWhere((q) =>
      q.whereIn("lifecycleStatus", processorStatusesThatNeedWork)
    )
    .andWhere({ deleted: false })
    .limit(1);

  // If we found one, update the processor to the one passed in
  if (found.length > 0) {
    const updatedRows = await db<Environment>("environments")
      .update({ processor: input.currentProcessor, updated_at: db.fn.now() })
      .whereNull("processor")
      .andWhere({
        id: found[0].id,
      })
      .limit(1);

    // We updated, meaning this processor has dibs
    if (updatedRows > 0) {
      return found[0];
    }
    // Uh oh... no updated rows. That means another processor got here first!
    log.warning(
      "getEnvironmentThatNeedsWork: Environment processor found work, but another processor took it. Trying again."
    );
  }
  log.debug(
    "getEnvironmentThatNeedsWork: Environment processor couldn't find any environments to process against."
  );
}
