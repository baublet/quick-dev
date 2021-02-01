import { EnvironmentCommand, EnvironmentCommandStatus } from "./index";
import { Connection } from "../../db";
import { log } from "../../../../common/logger";

const processorStatusesThatNeedWork: EnvironmentCommandStatus[] = ["ready"];

export async function getEnvironmentCommandThatNeedsWork(
  db: Connection,
  input: {
    currentProcessor: string;
  }
) {
  const updatedRows = await db<EnvironmentCommand>("environmentCommands")
    .update({ processor: input.currentProcessor, updated_at: db.fn.now() })
    .andWhere((b) => {
      b.whereIn("status", processorStatusesThatNeedWork);
      b.whereNull("processor");
      b.where("updated_at", "<=", db.raw("NOW() - INTERVAL '10 seconds'"));
    })
    .limit(1)
    .returning("*");

  if (updatedRows.length > 0) {
    return updatedRows[0];
  }

  log.debug("getEnvironmentCommandThatNeedsWork: no environment needs work");
}
