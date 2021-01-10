import { Environment, update } from "../common/environment";
import { DigitalOceanHandler } from "../common/environmentHandler/digitalOcean";
import { ConnectionOrTransaction } from "../common/db";
import { log } from "../../common/logger";

export async function processNewEnvironment(
  db: ConnectionOrTransaction,
  environment: Environment
) {
  let createdDropletId: string;

  try {
    await update(db, environment.id, {
      lifecycleStatus: "creating",
    });
    const createdDroplet = await DigitalOceanHandler.newEnvironment(
      environment
    );
    createdDropletId = createdDroplet.id;
    await update(db, environment.id, {
      processor: null,
      sourceId: createdDroplet.id,
    });
  } catch (e) {
    if (createdDropletId) {
      await DigitalOceanHandler.destroyEnvironment(environment, []);
    }
    throw e;
  }
}
