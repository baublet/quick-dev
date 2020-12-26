import {
  Environment,
  EnvironmentSource,
  EnvironmentLifecycleStatus,
} from "./index";
import { ConnectionOrTransaction } from "../db";

const processorStatusesThatNeedWork: EnvironmentLifecycleStatus[] = ["new"];

export async function getEnvironmentThatNeedsWork(
  trx: ConnectionOrTransaction,
  input: {
    currentProcessor: string;
  }
): Promise<Environment | null> {
  // Try 3 times, then bail
  for (let i = 3; i > 0; i--) {
    // Grab an environment that needs work
    const found = await trx<Environment>("environments")
      .select()
      .where("processor", "=", null)
      .whereIn("lifeCycleStatus", processorStatusesThatNeedWork)
      .limit(1);

    // If we found one, update the processor to the one passed in
    if (found.length > 0) {
      const updatedRows = await trx<Environment>("environments")
        .update({ processor: input.currentProcessor })
        .where({
          id: found[0].id,
        })
        .limit(1);

      // We updated, meaning this processor has dibs
      if (updatedRows > 0) {
        return found[0];
      }
      // Uh oh... no updated rows. That means another processor got here first!
    }
  }
}
