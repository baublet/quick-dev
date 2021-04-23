import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetCleaningUpArguments } from ".";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";
import { canSetCleaningUp } from "./canSetCleaningUp";
import { enqueueJob } from "../../enqueueJob";

// Called by a box when it's up and starts running our provisioning scripts
export async function setCleaningUp({
  environment,
  trx,
}: SetCleaningUpArguments): Promise<StateMachineReturnValue> {
  const canContinue = await canSetCleaningUp({ trx, environment });
  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  await enqueueJob("");

  log.debug("Updated environment to provisioning", {
    environment: environment.subdomain,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
