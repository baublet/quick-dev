import { ExternalEnvironmentHandler } from "../index";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const snapshotEnvironment: ExternalEnvironmentHandler["snapshotEnvironment"] = (
  environment
) => {
  return new Promise(async (resolve) => {
    log.info("Snapshotting a DigitalOcean environment", {
      environment: environment.subdomain,
    });

    if (!environment.sourceId) {
      log.error("Unable to snapshot an environment without a source ID!", {
        environment,
      });
      throw new Error("Unable to snapshot an environment without a source ID!");
    }

    const result = await digitalOceanApi<{
      action: {
        id: string;
        status: "in-progress" | "completed" | "errored";
      };
    }>({
      path: `droplets/${environment.sourceId}/actions`,
      method: "post",
      body: {
        type: "snapshot",
        name: `${environment.subdomain}-${environment.id}`,
      },
    });

    return result.action;
  });
};
