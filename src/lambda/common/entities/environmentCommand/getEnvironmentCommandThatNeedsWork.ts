import { EnvironmentCommand, EnvironmentCommandStatus } from "./index";
import { Connection } from "../../db";
import { log } from "../../../../common/logger";
import { EnvironmentCommandLock } from "../environmentCommandLock";
import { randomBetween0AndN } from "../../../../common/randomBetween0AndN";

const processorStatusesThatNeedWork: EnvironmentCommandStatus[] = ["ready"];

export async function getEnvironmentCommandThatNeedsWork(
  db: Connection,
  input: {
    currentProcessor: string;
  }
) {
  const lockSubQuery = db<EnvironmentCommandLock>(
    "environmentCommandLocks"
  ).select("environmentCommandId");
  const results = await db<EnvironmentCommand>("environmentCommands")
    .update({ updated_at: db.fn.now() })
    .andWhere((b) => {
      b.whereIn("status", processorStatusesThatNeedWork);
      b.whereNotIn("id", lockSubQuery);
    })
    .limit(1)
    .returning("*");

  const rowNumber = randomBetween0AndN(results.length - 1);
  const row = results[rowNumber];

  if (row) {
    return row;
  }

  log.debug("getEnvironmentCommandThatNeedsWork: no environment needs work");
}
