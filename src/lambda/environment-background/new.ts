import { Environment, update } from "../common/environment";
import { DigitalOceanHandler } from "../common/environmentHandler/digitalOcean";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";

export async function processNewEnvironment(environment: Environment) {
  let createdDropletId: string;

  try {
    const createdDroplet = await DigitalOceanHandler.newEnvironment(
      environment
    );
    createdDropletId = createdDroplet.id;
    await update(getDatabaseConnection(), environment.id, {
      lifecycleStatus: "creating",
      processor: null,
      sourceId: createdDroplet.id,
    });
  } catch (e) {
    log.error("Error creating/updating an environment", {
      message: e.message,
    });
    if (createdDropletId) {
      await DigitalOceanHandler.destroyEnvironment({
        sourceId: createdDropletId,
      });
    }
    throw e;
  }
}
