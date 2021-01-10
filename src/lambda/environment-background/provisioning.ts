import {
  Environment,
  update as updateEnvironment,
} from "../common/environment";
import { getByEnvironmentId } from "../common/environmentCommand";
import { Transaction } from "../common/db";
import { enqueueJob } from "../common/enqueueJob";
import { log } from "../../common/logger";

export async function processProvisioningEnvironment(
  trx: Transaction,
  environment: Environment
) {
  const commands = await getByEnvironmentId(trx, environment.id);
  log.info("Received commands", { commands });

  if (commands.some((command) => command.status === "running")) {
    return;
  }

  if (!commands.some((command) => command.status === "waiting")) {
    await updateEnvironment(trx, environment.id, {
      lifecycleStatus: "starting",
    });
    return;
  }

  const commandToRunNext = (() => {
    for (const command of commands) {
      if (command.status === "waiting") {
        return command;
      }
    }
  })();

  await enqueueJob(trx, "sendCommand", {
    environmentCommandId: commandToRunNext.commandId,
  });
}
