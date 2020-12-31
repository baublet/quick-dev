import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";
import { environmentToUniqueName } from "../environmentToUniqueName";
import { sizeToDOSize } from "./sizeToDOSize";
import { getCurrentUrl } from "../../getCurrentUrl";

export const newEnvironment: EnvironmentHandler["newEnvironment"] = async (
  environment
) => {
  const name = environmentToUniqueName(environment);
  const size = sizeToDOSize(environment.size);
  const baseUrl = await getCurrentUrl();
  const provisionScript = `#!/bin/bash

sudo apt-get update

# Hit our function to tell StrapYard that our environment is up
IP_ADDRESS=$(curl http://checkip.amazonaws.com)
curl --header "Content-Type: application/json" \
  --header "Authorization: ${environment.secret}" \
  --request POST \
  --data "{\\"subdomain\\":\\"${environment.subdomain}\\", \\"ipv4\\": \\"$IP_ADDRESS\\"}" \
  "${baseUrl}/.netlify/functions/environmentProvisioning"

# install Node so we can start our dev server
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install pm2@latest -g
curl "${baseUrl}/.netlify/functions/getProvisioner" -o ~/provisioner.js
SECRET=${environment.secret} pm2 start ~/provisioner.js

# Safe delay so pm2 has time to boot the server
sleep 2
echo "~fin~"
  `;

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
