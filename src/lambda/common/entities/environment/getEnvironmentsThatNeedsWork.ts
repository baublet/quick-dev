import { EnvironmentLifecycleStatus, Environment } from "./index";
import { Connection } from "../../db";
import { EnvironmentLock } from "../environmentLock";

const processorStatusesThatNeedWork: EnvironmentLifecycleStatus[] = [
  "new",
  "provisioning",
];

export async function getEnvironmentsThatNeedsWork(db: Connection) {
  const lockSubQuery = db<EnvironmentLock>("environmentLocks").select(
    "environmentId"
  );
  return db<Environment>("environments")
    .select()
    .andWhere((b) => {
      b.where("deleted", "=", false);
      b.whereIn("lifecycleStatus", processorStatusesThatNeedWork);
      b.whereNotIn("id", lockSubQuery);
      b.where("working", "=", false);
      b.where("updated_at", "<", new Date(Date.now() - 1000 * 10));
    })
    .returning("*");
}
