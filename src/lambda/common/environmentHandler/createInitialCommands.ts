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
  && (echo "${base64Encode(
    sshKey.privateKey
  )}" | base64 -d) >> ~/.ssh/strapyard \
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
}
