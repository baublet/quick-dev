import { ProviderSSHKey, providerSSHKey } from "../../entities";
import { digitalOceanApi } from "./digitalOceanApi";
import { getOrCreateSSHKey as getOrCreateGitHubKey } from "../../gitHub";
import { Context } from "../../context";
import { log } from "../../../../common/logger";
import { ConnectionOrTransaction } from "../../db";
import { unauthorized } from "../../../graphql/common/unauthorized";
import { unauthorizedError } from "../../../graphql/common/unauthorizedError";

interface GetOrCreateKeyArgs {
  userId: string;
}

export async function getOrCreateSSHKey(
  trx: ConnectionOrTransaction,
  context: Context,
  args: GetOrCreateKeyArgs
): Promise<ProviderSSHKey> {
  const { userId } = args;

  if (!unauthorized(context)) {
    throw unauthorizedError(context);
  }

  const extant = await providerSSHKey.get(trx, {
    userId,
    source: "digital_ocean",
  });

  if (extant) {
    // Check that it exists in DO
    const extantKeyInDO = await digitalOceanApi<{
      ssh_key?: {
        id: number;
        fingerprint: string;
        name: string;
      };
    }>({
      path: `account/keys/${extant.sourceId}`,
      method: "get",
      skipCache: true,
    });

    // Create it in DO if it doesn't exist there (this can happen if the key
    // was deleted in our DO account. Common in development)
    if (!extantKeyInDO.ssh_key) {
      const sshKey = await getOrCreateGitHubKey(trx, context);
      const keyInDO = await saveKeyInDigitalOcean({
        fingerprint: sshKey.fingerprint,
        keyTitle: `StrapYard: ${userId}`,
        publicKey: sshKey.publicKey,
      });
      const updatedProviderKey = await providerSSHKey.update(trx, extant.id, {
        sourceId: `${keyInDO.id}`,
      });
      return updatedProviderKey;
    }

    return extant;
  }

  log.debug("No provider key for ", { userId });

  // Get/create an SSH key for this context
  const sshKey = await getOrCreateGitHubKey(trx, context);

  // Now, save the key to the provider (e.g., send it to DigitalOcean)
  const digitalOceanSSHKey = await saveKeyInDigitalOcean({
    fingerprint: sshKey.fingerprint,
    keyTitle: `StrapYard: ${userId}`,
    publicKey: sshKey.publicKey,
  });

  // Save the provider SSH key to the StrapYard DB (so we don't do all of
  // the above junk more than once
  return providerSSHKey.create(trx, {
    userId,
    source: "digital_ocean",
    sourceId: `${digitalOceanSSHKey.id}`,
    sshKeyId: sshKey.id,
  });
}

async function saveKeyInDigitalOcean({
  keyTitle,
  publicKey,
  fingerprint,
}: {
  keyTitle: string;
  publicKey: string;
  fingerprint: string;
}): Promise<{
  id: number;
  fingerprint: string;
  publicKey: string;
  name: string;
}> {
  const digitalOceanResponse = await digitalOceanApi<{
    message?: string;
    ssh_key: {
      id: number;
      fingerprint: string;
      public_key: string;
      name: string;
    };
  }>({
    path: "account/keys",
    expectStatus: 201,
    timeout: 5000,
    method: "post",
    body: {
      name: keyTitle,
      public_key: publicKey,
    },
    skipCache: true,
  });

  if (!digitalOceanResponse.message) {
    return {
      id: digitalOceanResponse.ssh_key.id,
      fingerprint: digitalOceanResponse.ssh_key.fingerprint,
      publicKey: digitalOceanResponse.ssh_key.public_key,
      name: digitalOceanResponse.ssh_key.name,
    };
  }

  log.error("Error sending SSH key to DigitalOcean", {
    digitalOceanResponse,
  });

  if (digitalOceanResponse.message.includes("SSH Key is already in use")) {
    const digitalOceanFetchKeyResponse = await digitalOceanApi<{
      message?: string;
      ssh_key: {
        id: number;
        fingerprint: string;
        public_key: string;
        name: string;
      };
    }>({
      path: `account/keys/${fingerprint}`,
      method: "get",
      expectStatus: 200,
    });

    if (digitalOceanFetchKeyResponse.ssh_key) {
      return {
        id: digitalOceanResponse.ssh_key.id,
        fingerprint: digitalOceanResponse.ssh_key.fingerprint,
        publicKey: digitalOceanResponse.ssh_key.public_key,
        name: digitalOceanResponse.ssh_key.name,
      };
    }
  }

  log.error("Unexpected error saving SSH key to the environment", {
    keyTitle,
    digitalOceanResponse,
  });

  throw new Error("Unexpected error saving SSH key to the environment");
}
