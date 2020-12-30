import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";
import { environmentToUniqueName } from "../environmentToUniqueName";
import { sizeToDOSize } from "./sizeToDOSize";
import { getProvisionScript } from "../../../../provisionerV1/getProvisionScript";

export const newEnvironment: EnvironmentHandler["newEnvironment"] = async (
  environment
) => {
  const name = environmentToUniqueName(environment);
  const size = sizeToDOSize(environment.size);
  const provisionScript = await getProvisionScript(environment);

  const body = {
    name,
    region: "nyc3",
    size,
    image: "ubuntu-16-04-x64",
    user_data: provisionScript,
  };

  log.info("Creating a new DigitalOcean environment", { body, environment });

  const createdDroplet = await digitalOceanApi<{
    droplet?: {
      id: number;
      name: string;
      status: "new" | "active" | "off" | "archive";
      memory: number;
      vcpus: number;
      disk: number;
      locked: boolean;
      size_slug: string;
    };
  }>({
    path: "droplets",
    body,
  });

  log.info({ createdDroplet });

  if (!createdDroplet.droplet) {
    log.error("Error creating droplet", { environment, createdDroplet });
    throw new Error(`Error creating droplet`);
  }
  const droplet = createdDroplet.droplet;

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
