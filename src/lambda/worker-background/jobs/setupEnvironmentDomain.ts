import { create } from "../../common/environmentDomainRecord";
import { getById } from "../../common/environment";
import { DigitalOceanHandler } from "../../common/environmentHandler/digitalOcean";

import { ConnectionOrTransaction } from "../../common/db";
import { log } from "../../../common/logger";

export const setupEnvironmentDomain = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
  }
) => {
  const environment = await getById(trx, payload.environmentId);

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

  await create(trx, {
    environmentId: environment.id,
    provider: environment.source,
    providerId: record.providerId,
    type,
    name,
    data,
  });
};
