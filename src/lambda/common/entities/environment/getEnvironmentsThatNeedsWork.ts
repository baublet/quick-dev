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
    .andWhere((b) => {
      b.where("deleted", "=", false);
      b.whereIn("lifecycleStatus", processorStatusesThatNeedWork);
      b.where("working", "=", false);
      b.where("updated_at", "<", new Date(Date.now() - 1000 * 3));
    })
    .returning("*");
}
