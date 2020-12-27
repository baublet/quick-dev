import { Environment, update } from "../common/environment";
import { DigitalOceanHandler } from "../common/environmentHandler/digitalOcean";
import { getDatabaseConnection } from "../common/db";
import { log } from "../../common/logger";

export async function processCreatingEnvironment(environment: Environment) {
  const droplet = await DigitalOceanHandler.getEnvironment(environment);

  log.debug("getDroplet return: ", { droplet });

  if (droplet.status === "active") {
    await update(getDatabaseConnection(), environment.id, {
      lifecycleStatus: "ready_to_provision",
      processor: null,
    });
  }
}
