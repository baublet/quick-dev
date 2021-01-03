import { log } from "../../../../../common/logger";
import { digitalOceanApi } from "../digitalOceanApi";
import { EnvironmentHandler } from "../../index";
import { environmentToUniqueName } from "../../environmentToUniqueName";
import { sizeToDOSize } from "../sizeToDOSize";
import { getCurrentUrl } from "../../../getCurrentUrl";
import { getSSHKeyOrThrow } from "../../../gitHub";
import { getDatabaseConnection } from "../../../db";
import { getBySSHKeyId } from "../../../providerSSHKey";

export const newEnvironment: EnvironmentHandler["newEnvironment"] = async (
  environment
) => {
  const db = getDatabaseConnection();
  return db.transaction(async (trx) => {
    const name = environmentToUniqueName(environment);
    const size = sizeToDOSize(environment.size);
    const baseUrl = await getCurrentUrl();
    const sshKey = await getSSHKeyOrThrow(
      trx,
      environment.user,
      environment.userSource
    );
    const providerSshKey = await getBySSHKeyId(trx, sshKey.id);

    if (!providerSshKey) {
      log.error("Provider SSH key not found for extant SSH key", {
        sshKey,
        environment,
      });
      throw new Error("Provider SSH key not found for extant SSH key");
    }

    const provisionScript = `#!/bin/bash

whoami
pwd
cd /root
sudo apt-get update

# Hit our function to tell StrapYard that our environment is up
IP_ADDRESS=$(curl http://checkip.amazonaws.com)
curl --header "Content-Type: application/json" \
  --header "Authorization: ${environment.secret}" \
  --request POST \
  --data "{\\"subdomain\\":\\"${environment.subdomain}\\", \\"ipv4\\": \\"$IP_ADDRESS\\"}" \
  "${baseUrl}/.netlify/functions/environmentCreated"

# install Node so we can start our dev server
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install pm2@latest -g

# Pull down our bundled and fully packed provisioner server and boot it up 8)
curl "${baseUrl}/.netlify/functions/getProvisioner" -o ~/provisioner.js
SECRET=${environment.secret} pm2 start ~/provisioner.js --watch

# Safe delay so pm2 has time to boot the server
sleep 2

curl --header "Content-Type: application/json" \
  --header "Authorization: ${environment.secret}" \
  --request POST \
  --data "{\\"subdomain\\":\\"${environment.subdomain}\\"}" \
  "${baseUrl}/.netlify/functions/environmentReadyToProvision"

echo "~fin~"
  `;

    const body = {
      name,
      region: "nyc3",
      size,
      image: "ubuntu-16-04-x64",
      user_data: provisionScript,
      ssh_keys: [providerSshKey.sourceId],
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
  });
};
