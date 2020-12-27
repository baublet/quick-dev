import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";

export const destroyEnvironment: EnvironmentHandler["destroyEnvironment"] = async (
  environment
) => {
  log.info("Destroying a DigitalOcean environment", { environment });

  let environmentId: string;

  if (typeof environment === "string") {
    environmentId = environment;
  } else {
    environmentId = environment.sourceId;
  }

  if (!environmentId) {
    throw new Error(`No environment ID! ${environment}`);
  }

  await digitalOceanApi<"">({
    path: `droplets/${environment}`,
    method: "delete",
  });
};
