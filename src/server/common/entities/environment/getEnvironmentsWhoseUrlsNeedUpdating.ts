import { EnvironmentLifecycleStatus, Environment } from "./index";
import { Connection } from "../../db";

const processorStatusesThatNeedWork: EnvironmentLifecycleStatus[] = [
  "provisioning",
  "finished_provisioning",
  "ready",
  "starting_from_snapshot",
];

export async function getEnvironmentsWhoseUrlsNeedUpdating(db: Connection) {
  return db<Environment>("environments")
    .select()
    .andWhere((b) => {
      b.where("deleted", "=", false);
      b.whereIn("lifecycleStatus", processorStatusesThatNeedWork);
    })
    .returning("*");
}
