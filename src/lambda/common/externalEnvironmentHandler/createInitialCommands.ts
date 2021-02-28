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
    command: `mkdir -p /root/project \
&& (cd ~/project; git clone ${environment.repositoryUrl})`,
    environmentId: environment.id,
    title: "Clone Repository",
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
reverse_proxy 127.0.0.1:8080" > /etc/caddy/Caddyfile \
&& sudo systemctl reload caddy`,
    environmentId: environment.id,
    title: "Install Web Server",
    adminOnly: true,
    status: "ready",
  });

  await environmentCommand.create(trx, {
    command: `mkdir -p "$HOME/.config/code-server" && echo "bind-addr: 127.0.0.1:8080\n \
auth: password\n \
password: aa82dd974de376d337fb0854\n \
home: ${process.env.STRAPYARD_URL}/environment/${environment.subdomain}\n \
cert: false" > /root/.config/code-server/config.yaml \
&& sudo systemctl restart code-server@root`,
    environmentId: environment.id,
    title: "Configure Code Server",
    adminOnly: true,
    status: "ready",
  });
}
