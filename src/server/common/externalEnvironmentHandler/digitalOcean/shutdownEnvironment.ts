import { ExternalEnvironmentHandler } from "../index";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const shutdownEnvironment: ExternalEnvironmentHandler["shutdownEnvironment"] = async (
  environment,
  environmentDomainRecords
) => {
  log.info("shutdownEnvironment", {
    environment: environment.subdomain,
    environmentDomainRecords,
  });

  const shutdownAction = await digitalOceanApi<{
    id: string;
    status: "in-progress" | "completed" | "errored";
  }>({
    path: `droplets/${environment.sourceId}/actions`,
    method: "post",
    timeout: 10000,
    skipCache: true,
    body: {
      type: "shutdown",
    },
  });

  // Delete the domain records. When we recreate the environment, it'll have a new IP
  await Promise.all(
    environmentDomainRecords.map((record) =>
      digitalOceanApi({
        path: `domains/${process.env.STRAPYARD_DOMAIN}/records/${record.providerId}`,
        method: "delete",
        expectJson: false,
      })
    )
  );

  return shutdownAction;
};
