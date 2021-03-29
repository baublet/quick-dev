import {
  environment as envEntity,
  environmentDomainRecord as envDomainEntity,
} from "../entities";
import { DigitalOceanHandler } from "../../common/externalEnvironmentHandler/digitalOcean";
import { getDatabaseConnection } from "../../common/db";
import { log } from "../../../common/logger";
import { environmentStateMachine } from "../environmentStateMachine";

export const setupEnvironmentDomain = async (payload: {
  environmentId: string;
}) => {
  const db = getDatabaseConnection();
  const environment = await envEntity.getById(db, payload.environmentId);

  if (!environment) {
    throw new Error(
      `setupEnvironmentDomain invariance violation. Expected environment ${environment} to exist. It did not.`
    );
  }

  //

  const type = "A";
  const name = `${environment.subdomain}.env`;
  const data = environment.ipv4;

  const record = await DigitalOceanHandler.createEnvironmentDomainRecord(
    type,
    name,
    data
  );

  log.debug("Domain record created in DigitalOcean", {
    type,
    name,
    data,
    record,
  });

  await envDomainEntity.create(db, {
    environmentId: environment.id,
    provider: environment.source,
    providerId: record.providerId,
    type,
    name,
    data,
  });

  await db.transaction(async (trx) => {
    await environmentStateMachine.setProvisioning({
      trx,
      environment,
    });
  });
};
