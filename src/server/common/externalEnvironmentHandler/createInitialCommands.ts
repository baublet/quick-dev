import { createHash } from "crypto";

import { Transaction } from "../db";
import { Environment } from "../entities";
import { environmentCommand } from "../entities";

interface AddSSHKeyArguments {
  environment: Environment;
}

export async function createInitialCommands(
  trx: Transaction,
  { environment }: AddSSHKeyArguments
): Promise<void> {
  await environmentCommand.create(trx, {
    command: `mv /root/.bashrc /root/.bashrc_backup; echo "" >> /root/.bashrc; chmod +x /root/.bashrc`,
    environmentId: environment.id,
    title: "Setup .bashrc",
    adminOnly: true,
    status: "ready",
    workingDirectory: "~",
  });

  await environmentCommand.create(trx, {
    command: `sudo apt-get -y update && sudo apt-get -y upgrade`,
    environmentId: environment.id,
    title: "Update and Upgrade",
    adminOnly: true,
    status: "ready",
    workingDirectory: "~",
  });

  await environmentCommand.create(trx, {
    command: `sudo apt-get -y install python3 build-essential`,
    environmentId: environment.id,
    title: "Build Essentials",
    adminOnly: true,
    status: "ready",
    workingDirectory: "~",
  });

  await environmentCommand.create(trx, {
    command: `mkdir -p /root/project \
&& (cd ~/project; git clone ${environment.repositoryUrl} .)`,
    environmentId: environment.id,
    title: "Clone Repository",
    adminOnly: true,
    status: "ready",
    workingDirectory: "~",
  });

  await environmentCommand.create(trx, {
    command: `sudo apt-get install -y \
  apt-transport-https ca-certificates \
  gnupg-agent software-properties-common \
&& curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
&& sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable" \
&& sudo apt-get update \
&& sudo apt-get install -y docker-ce docker-ce-cli containerd.io`,
    environmentId: environment.id,
    title: "Install Docker",
    adminOnly: true,
    status: "ready",
  });

  await environmentCommand.create(trx, {
    command: `(curl -fsSL https://code-server.dev/install.sh | sh) \
&& sudo systemctl enable --now code-server@$USER`,
    environmentId: environment.id,
    title: "Install VS Code Server",
    adminOnly: true,
    status: "ready",
  });

  await environmentCommand.create(trx, {
    command: `sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https \
&& curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add - \
&& curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee -a /etc/apt/sources.list.d/caddy-stable.list \
&& sudo apt update \
&& sudo apt install caddy \
&& echo "${environment.subdomain}.env.${process.env.STRAPYARD_DOMAIN}\n\n\
reverse_proxy 127.0.0.1:8080\n\n

log {
  output file /var/log/access.log {
    roll_size 1gb
    roll_keep 5
    roll_keep_for 720h
  }
}" > /etc/caddy/Caddyfile \
&& sudo systemctl reload caddy`,
    environmentId: environment.id,
    title: "Install Web Server",
    adminOnly: true,
    status: "ready",
  });

  const hashedSecret = createHash("sha256")
    .update(environment.secret)
    .digest("hex");
  await environmentCommand.create(trx, {
    command: `mkdir -p "$HOME/.config/code-server" && echo "bind-addr: 127.0.0.1:8080\n\
auth: password\n\
hashed-password: ${hashedSecret}\n\
cert: false" > /root/.config/code-server/config.yaml\
&& sudo systemctl restart code-server@root`,
    environmentId: environment.id,
    title: "Configure Code Server",
    adminOnly: true,
    status: "ready",
  });
}
