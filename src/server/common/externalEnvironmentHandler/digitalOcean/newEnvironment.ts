import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { ExternalEnvironmentHandler } from "../index";
import { environmentToUniqueName } from "../environmentToUniqueName";
import { sizeToDOSize } from "./sizeToDOSize";
import { getSSHKeyOrThrow } from "../../gitHub";
import { getDatabaseConnection } from "../../db";
import { providerSSHKey } from "../../entities";

export const newEnvironment: ExternalEnvironmentHandler["newEnvironment"] = async (
  environment
) => {
  log.info("Provisioning new DigitalOcean environment", {
    environment,
  });

  const db = getDatabaseConnection();
  return db.transaction(async (trx) => {
    const name = environmentToUniqueName(environment);
    const size = sizeToDOSize(environment.size);
    const sshKey = await getSSHKeyOrThrow(
      trx,
      environment.user,
      environment.userSource
    );
    const providerSshKey = await providerSSHKey.getBySSHKeyId(trx, sshKey.id);

    if (!providerSshKey) {
      log.error("Provider SSH key not found for extant SSH key", {
        sshKey,
        environment,
      });
      throw new Error("Provider SSH key not found for extant SSH key");
    }

    const provisionScript = ``;

    const body = {
      name,
      region: "nyc3",
      size,
      image: "ubuntu-16-04-x64",
      user_data: provisionScript,
      ssh_keys: [providerSshKey.sourceId],
      tags: [environment.id],
    };

    log.info("Creating a new DigitalOcean environment", {
      body,
      environment: environment.subdomain,
    });

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
      expectStatus: 202,
      timeout: 7500,
      skipCache: true,
    });

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
  });
};
