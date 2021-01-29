import {
  environment as envEntity,
  environmentDomainRecord as envDomainEntity,
} from "../entities";
import { DigitalOceanHandler } from "../../common/externalEnvironmentHandler/digitalOcean";
import { ConnectionOrTransaction } from "../../common/db";
import { log } from "../../../common/logger";

export const setupEnvironmentDomain = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
  }
) => {
  const environment = await envEntity.getById(trx, payload.environmentId);

  if (!environment) {
    throw new Error(
      `setupEnvironmentDomain invariance violation. Expected environment ${environment} to exist. It did not.`
    );
  }

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

  await envDomainEntity.create(trx, {
    environmentId: environment.id,
    provider: environment.source,
    providerId: record.providerId,
    type,
    name,
    data,
  });
};
