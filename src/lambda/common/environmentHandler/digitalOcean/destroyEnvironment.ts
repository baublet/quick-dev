import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";

export const destroyEnvironment: EnvironmentHandler["destroyEnvironment"] = async (
  environment
) => {
  log.info("Destroying a DigitalOcean environment", { environment });

  await digitalOceanApi({
    path: `droplets/${environment.sourceId}`,
    method: "delete",
    expectStatus: 204,
  });
};
