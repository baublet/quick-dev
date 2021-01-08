import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";

export const destroyEnvironment: EnvironmentHandler["destroyEnvironment"] = async (
  environment,
  environmentDomainRecords
) => {
  log.info("Destroying a DigitalOcean environment and its domain records", {
    environment,
    environmentDomainRecords,
  });

  await digitalOceanApi({
    path: `droplets/${environment.sourceId}`,
    method: "delete",
  });

  await Promise.all(
    environmentDomainRecords.map((record) =>
      digitalOceanApi({
        path: `domains/${process.env.STRAPYARD_DOMAIN}/records/${record.providerId}`,
        method: "delete",
      })
    )
  );
};
