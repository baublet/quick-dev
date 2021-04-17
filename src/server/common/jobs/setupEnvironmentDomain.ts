import {
  environment as envEntity,
  environmentDomainRecord as envDomainEntity,
} from "../entities";
import { getExternalEnvironmentHandler } from "../../common/externalEnvironmentHandler";
import { getDatabaseConnection } from "../../common/db";
import { log } from "../../../common/logger";

export const setupEnvironmentDomain = async (payload: {
  environmentId: string;
}) => {
  const db = getDatabaseConnection();
  const environment = await envEntity.getByIdOrFail(db, payload.environmentId);

  const existingDomainRecords = await envDomainEntity.getByEnvironmentId(
    db,
    environment.id
  );
  if (existingDomainRecords.length > 0) {
    log.info("Environment domain records already created, skipping", {
      environment: environment.subdomain,
    });
    return;
  }

  const type = "A";
  const name = `${environment.subdomain}.env`;
  const data = environment.ipv4;

  const record = await getExternalEnvironmentHandler(
    environment
  ).createEnvironmentDomainRecord(type, name, data);

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
};
