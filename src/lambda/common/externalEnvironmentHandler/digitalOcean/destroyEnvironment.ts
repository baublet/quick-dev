import { ExternalEnvironmentHandler } from "../index";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const destroyEnvironment: ExternalEnvironmentHandler["destroyEnvironment"] = async (
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
    expectStatus: 204,
    expectJson: false,
  });

  await Promise.all(
    environmentDomainRecords.map((record) =>
      digitalOceanApi({
        path: `domains/${process.env.STRAPYARD_DOMAIN}/records/${record.providerId}`,
        method: "delete",
        expectStatus: 204,
        expectJson: false,
      })
    )
  );
};
