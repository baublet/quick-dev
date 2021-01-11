import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { ExternalEnvironmentHandler } from "../index";

export const getEnvironment: ExternalEnvironmentHandler["newEnvironment"] = async (
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
      networks: {
        v4: {
          ip_address: string;
          netmask: string;
          gateway: string;
          type: string;
        }[];
      };
    };
  }>({
    path: `droplets/${environment.sourceId}`,
    method: "get",
    expectStatus: 200,
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
    ipv4: droplet.networks.v4.length
      ? droplet.networks.v4[0].ip_address
      : undefined,
  };
};
