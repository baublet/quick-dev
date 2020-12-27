import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";

export const getEnvironment: EnvironmentHandler["newEnvironment"] = async (
  environment
) => {
  if (!environment.sourceId) {
    throw new Error(
      `Cannot get an external box correlating to environment ${environment.subdomain}. No SourceID exists for that environment. It was probably never created.`
    );
  }

  log.info("Fetching a DigitalOcean environment", { environment });

  const fetchedDroplet = await digitalOceanApi<{
    droplet?: {
      id: number;
      name: string;
      status: "new" | "active" | "off" | "archive";
      memory: number;
      vcpus: number;
      disk: number;
      locked: boolean;
      kernel: {
        name: string;
      };
      size_slug: string;
    };
  }>({
    method: "get",
    path: `droplets/${environment.sourceId}`,
  });

  if (!fetchedDroplet.droplet) {
    log.error("Error fetching droplet", { environment, fetchedDroplet });
    throw new Error(`Error creating droplet`);
  }
  const droplet = fetchedDroplet.droplet;

  return {
    id: droplet.id.toString(),
    name: droplet.name,
    memory: Math.floor(droplet.memory / 1000),
    cpus: droplet.vcpus,
    disk: droplet.disk,
    locked: droplet.locked,
    status: droplet.status,
    sizeSlug: droplet.size_slug,
    provider: "digital_ocean",
  };
};
