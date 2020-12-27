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
    if (createdDropletId) {
      log.error("Error creating/updating an environment", { message: e.message });
      await DigitalOceanHandler.destroyEnvironment(createdDropletId);
    }
    throw e;
  }
}
