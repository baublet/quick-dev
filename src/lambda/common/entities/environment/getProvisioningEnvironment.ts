import { Environment } from "./index";
import { Connection } from "../../db";
import { randomBetween0AndN } from "../../../../common/randomBetween0AndN";

export async function getProvisioningEnvironment(db: Connection) {
  const environments = await db<Environment>("environments")
    .select()
    .andWhere((b) => {
      b.where("deleted", "=", false);
      b.where("lifecycleStatus", "=", "provisioning");
      b.where("working", "=", false);
    })
    .limit(25)
    .returning("*");

  const rowNumber = randomBetween0AndN(environments.length - 1);
  const environment = environments[rowNumber];

  if (environment) {
    return environment;
  }
}
