import { environment as envEntity } from "../entities";
import { getDatabaseConnection } from "../db";
import { log } from "../../../common/logger";

export async function rescueStuckEnvironments() {
  const db = getDatabaseConnection();
  const environments = await envEntity.rescueEnvironments(db);

  if (environments.length) {
    log.debug(`Attempting to rescue ${environments.length} environments`, {
      environments: environments.map((env) => env.subdomain),
    });
  }
}
