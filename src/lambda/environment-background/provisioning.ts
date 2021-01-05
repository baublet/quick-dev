import { Environment, update as updateEnvironment } from "../common/environment";
import { getByEnvironmentId } from "../common/environmentCommand";
import { getDatabaseConnection } from "../common/db";
import { enqueueJob } from "../common/enqueueJob";

export async function processProvisioningEnvironment(environment: Environment) {
  const db = getDatabaseConnection();
  return db.transaction(async trx => {
    const commands = await getByEnvironmentId(trx, environment.id);
    
    if(commands.some(command => command.status === "running")) {
      return;
    }

    if(!commands.some(command => command.status === "waiting")) {
      await updateEnvironment(trx, environment.id, { lifecycleStatus: "starting" })
      return;
    }

    const commandToRunNext = commands.find(command => command.status === "waiting");

    await enqueueJob(trx, "sendCommand", { environmentCommandId: commandToRunNext.id })
  })
}
