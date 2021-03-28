import {
  environment as envEntity,
  environmentDomainRecord,
} from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetStoppedArguments } from ".";
import { canSetStopped } from "./canSetStopped";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { enqueueJob } from "../../enqueueJob";

export async function setStopped({
  trx,
  environment,
}: SetStoppedArguments): Promise<StateMachineReturnValue> {
  log.debug("setStopped: Setting environment to status: stopped", {
    environment: environment.name,
  });

  const canContinue = await canSetStopped({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "stopped",
  });

  log.debug("setStopped: Updated environment to stopped", {
    environment: environment.subdomain,
  });

  await enqueueJob("deleteEnvironmentInProvider", {
    environmentId: environment.id,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
