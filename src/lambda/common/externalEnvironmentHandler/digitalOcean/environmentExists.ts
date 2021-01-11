import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { ExternalEnvironmentHandler } from "../index";

export const environmentExists: ExternalEnvironmentHandler["environmentExists"] = async (
  environment
) => {
  const taggedDroplets = await digitalOceanApi<{
    droplets: {
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
    }[];
  }>({
    path: `droplets?tag_name=${environment.id}`,
    method: "get",
    expectStatus: 200,
  });

  if (taggedDroplets.droplets.length === 0) {
    return false;
  }
  const droplet = taggedDroplets.droplets[0];

  if (taggedDroplets.droplets.length > 1) {
    log.warning(
      "Multiple droplets found for a single environment ID. FIND OUT WHY AND FIX THIS!",
      { environment, taggedDroplets }
    );
  }

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
