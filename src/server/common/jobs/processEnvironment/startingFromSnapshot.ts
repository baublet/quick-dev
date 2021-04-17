import {
  environment as envEntity,
  Environment,
  environmentSnapshot,
  environmentDomainRecord,
} from "../../entities";
import { Transaction } from "../../db";
import { log } from "../../../../common/logger";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";
import { environmentStateMachine } from "../../environmentStateMachine";
import { enqueueJob } from "../../enqueueJob";

export async function processStartingFromSnapshot(
  trx: Transaction,
  environment: Environment
) {
  log.debug("processStartingFromSnapshot", {
    environment: environment.subdomain,
  });

  // If the environment has no source ID, something went wrong with spinning up
  // the environment in the external provider. This is a big error, so move the
  // environment to failed...
  if (!environment.sourceId) {
    await environmentStateMachine.setErrorProvisioning({
      trx,
      environment,
    });
    return;
  }

  const environmentInSource = await getExternalEnvironmentHandler(
    environment
  ).getEnvironment(environment);

  if (!environmentInSource) {
    log.warn(
      "Environment marked as starting from snapshot, but has no record of being in the provider! This is probably OK, but might indicate an error in the link between our provider and StrapYard",
      {
        environment: environment.subdomain,
      }
    );
    await environmentStateMachine.setErrorProvisioning({
      trx,
      environment,
    });
    return;
  }

  if (environmentInSource.ipv4 && !environment.ipv4) {
    await envEntity.update(trx, environment.id, {
      ipv4: environmentInSource.ipv4,
    });
    const domainRecords = await environmentDomainRecord.getByEnvironmentId(
      trx,
      environment.id
    );
    if (domainRecords.length === 0) {
      await enqueueJob("setupEnvironmentDomain", {
        environmentId: environment.id,
      });
    }
  }

  if (environmentInSource.status === "active") {
    log.debug("Environment ready to go, setting to ready", {
      environmentSnapshot,
    });
    await environmentStateMachine.setReady({ trx, environment });
    return;
  }
}
