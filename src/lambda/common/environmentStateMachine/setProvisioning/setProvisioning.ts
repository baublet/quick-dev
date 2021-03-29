import {
  environment as envEntity,
  environmentDomainRecord,
} from "../../entities";
import { log } from "../../../../common/logger";
import { enqueueJob } from "../../enqueueJob";
import { StateMachineReturnValue } from "..";
import { SetProvisioningArguments } from ".";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { canSetProvisioning } from "./canSetProvisioning";

// Called by a box when it's up and starts running our provisioning scripts
export async function setProvisioning({
  environment,
  trx,
}: SetProvisioningArguments): Promise<StateMachineReturnValue> {
  const canContinue = await canSetProvisioning({ trx, environment });
  if (!canContinue.operationSuccess) {
    return canContinue;
  }

  const environmentDomainRecords = await environmentDomainRecord.getByEnvironmentId(
    trx,
    environment.id
  );

  // Update the environment in the database
  try {
    const environmentInProvider = await DigitalOceanHandler.getEnvironment(
      environment
    );
    const ipv4 = environment.ipv4 || environmentInProvider.ipv4;
    if (environmentDomainRecords.length > 0) {
      await enqueueJob("setupEnvironmentDomain", {
        environmentId: environment.id,
      });
    } else {
      log.debug("Environment domains already created. Skipping...", {
        environment: environment.subdomain,
      });
    }
    await enqueueJob("getEnvironmentStartupLogs", {
      environmentId: environment.id,
    });
    await envEntity.update(trx, environment.id, {
      lifecycleStatus: "provisioning",
      ipv4,
    });
  } catch (e) {
    log.error("Unknown error setting environment to provisioning", {
      message: e.message,
      stack: e.stack,
    });
    return {
      operationSuccess: false,
      errors: [e.message, e.stack],
    };
  }

  log.debug("Updated environment to provisioning", {
    environment: environment.name,
  });

  return {
    operationSuccess: true,
    errors: [],
  };
}
