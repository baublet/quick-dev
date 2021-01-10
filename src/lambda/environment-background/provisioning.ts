import {
  environment as envEntity,
  Environment,
  environmentCommand as envCommandEntity,
} from "../common/entities";
import { Transaction } from "../common/db";
import { enqueueJob } from "../common/enqueueJob";
import { log } from "../../common/logger";

export async function processProvisioningEnvironment(
  trx: Transaction,
  environment: Environment
) {
  const commands = await envCommandEntity.getByEnvironmentId(
    trx,
    environment.id
  );
  log.info("Received commands", { commands });

  if (commands.some((command) => command.status === "running")) {
    return;
  }

  if (!commands.some((command) => command.status === "waiting")) {
    await envEntity.update(trx, environment.id, {
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
