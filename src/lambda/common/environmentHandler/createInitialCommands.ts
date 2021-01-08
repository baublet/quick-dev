import { base64Encode } from "../base64Encode";
import { Transaction } from "../db";
import { enqueueJob } from "../enqueueJob";
import { Environment } from "../environment";
import { create } from "../environmentCommand";
import { SSHKey } from "../sshKey";

interface AddSSHKeyArguments {
  environment: Environment;
  sshKey: SSHKey;
}

export async function createInitialCommands(
  trx: Transaction,
  { sshKey, environment }: AddSSHKeyArguments
): Promise<void> {
  await create(trx, {
    command: `eval $(ssh-agent -s) \
&& (echo "${base64Encode(sshKey.privateKey)}" | base64 -d) >> ~/.ssh/strapyard \
&& chmod 0600 ~/.ssh/strapyard \
&& ssh-add ~/.ssh/strapyard \
&& mkdir -p ~/project \
&& (cd ~/project; git clone ${environment.repositoryUrl})`,
    environmentId: environment.id,
    title: "Add SSH Keys",
    adminOnly: true,
    status: "waiting",
  });

  await create(trx, {
    command: `mkdir -p ~/project \
&& (cd ~/project; git clone ${environment.repositoryUrl})`,
    environmentId: environment.id,
    title: "Clone Repository",
    adminOnly: true,
    status: "waiting",
  });

  await create(trx, {
    command: `(curl -fsSL https://code-server.dev/install.sh | sh) \
&& sudo systemctl enable --now code-server@$USER`,
    environmentId: environment.id,
    title: "Install VS Code Server",
    adminOnly: true,
    status: "waiting",
  });

  await create(trx, {
    command: `( \
  echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" \
    | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list \
  )\
&& sudo apt update \
&& sudo apt install caddy \
&& echo "${environment.subdomain}.${process.env.STRAPYARD_DOMAIN} \
reverse_proxy 127.0.0.1:8080" > /etc/caddy/Caddyfile \
&& sudo systemctl reload caddy \
&& sudo systemctl restart code-server@$USER`,
    environmentId: environment.id,
    title: "Install Web Server",
    adminOnly: true,
    status: "waiting",
  });
}
