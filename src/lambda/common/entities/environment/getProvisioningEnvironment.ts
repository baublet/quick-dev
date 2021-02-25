import { Environment } from "./index";
import { Connection } from "../../db";
import { EnvironmentLock } from "../environmentLock";
import { randomBetween0AndN } from "../../../../common/randomBetween0AndN";

export async function getProvisioningEnvironment(db: Connection) {
  const lockSubQuery = db<EnvironmentLock>("environmentLocks").select(
    "environmentId"
  );
  const environments = await db<Environment>("environments")
    .select()
    .andWhere((b) => {
      b.where("deleted", "=", false);
      b.where("lifecycleStatus", "=", "provisioning");
      b.whereNotIn("id", lockSubQuery);
    })
    .limit(25)
    .returning("*");

  const rowNumber = randomBetween0AndN(environments.length - 1);
  const environment = environments[rowNumber];

  if (environment) {
    return environment;
  }
}
