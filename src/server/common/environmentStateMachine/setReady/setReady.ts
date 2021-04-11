import { environment as envEntity } from "../../entities";
import { log } from "../../../../common/logger";
import { StateMachineReturnValue } from "..";
import { SetReadyArguments } from ".";
import { canSetReady } from "./canSetReady";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { enqueueJob } from "../../enqueueJob";

export async function setReady({
  trx,
  environment,
}: SetReadyArguments): Promise<StateMachineReturnValue> {
  log.debug("setStarted: Setting environment to status: started", {
    environment: environment.subdomain,
  });

  const canContinue = await canSetReady({
    trx,
    environment,
  });

  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  await enqueueJob("deleteEnvironmentSnapshots", {
    environmentId: environment.id,
  });

  await envEntity.update(trx, environment.id, {
    lifecycleStatus: "ready",
    sourceSnapshotId: "",
  });

  log.debug(
    "setFinishedProvisioning: Updated environment to finished provisioning",
    {
      environment: environment.subdomain,
    }
  );

  return {
    operationSuccess: true,
    errors: [],
  };
}
