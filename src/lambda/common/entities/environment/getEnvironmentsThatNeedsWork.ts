import { EnvironmentLifecycleStatus, Environment } from "./index";
import { Connection } from "../../db";

const processorStatusesThatNeedWork: EnvironmentLifecycleStatus[] = [
  "new",
  "provisioning",
  "finished_provisioning",
  "stopping",
  "snapshotting",
];

export async function getEnvironmentsThatNeedsWork(db: Connection) {
  return db<Environment>("environments")
    .select()
    .andWhere((db) => {
      db.where("deleted", "=", false);
      db.whereIn("lifecycleStatus", processorStatusesThatNeedWork);
      db.where("updated_at", "<", new Date(Date.now() - 1000 * 3));
      db.where("working", "=", "false");
    })
    .returning("*");
}
