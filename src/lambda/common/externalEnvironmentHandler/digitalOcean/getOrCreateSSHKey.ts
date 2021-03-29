import { Environment, ProviderSSHKey, providerSSHKey } from "../../entities";
import { digitalOceanApi } from "./digitalOceanApi";
import { getOrCreateSSHKey as getOrCreateGitHubKey } from "../../gitHub";
import { Context } from "../../context";
import { log } from "../../../../common/logger";
import { ConnectionOrTransaction } from "../../db";
import { unauthorized } from "../../../graphql/common/unauthorized";
import { unauthorizedError } from "../../../graphql/common/unauthorizedError";

interface GetOrCreateKeyArgs {
  user: string;
  userSource: Environment["userSource"];
}

export async function getOrCreateSSHKey(
  trx: ConnectionOrTransaction,
  context: Context,
  args: GetOrCreateKeyArgs
): Promise<ProviderSSHKey> {
  const { user, userSource } = args;

  if (!unauthorized(context)) {
    throw unauthorizedError(context);
  }

  const extant = await providerSSHKey.get(trx, {
    user,
    userSource,
    source: "digital_ocean",
  });

  if (extant) {
    return extant;
  }

  log.debug("No provider key for ", { user, userSource });

  // Get/create an SSH key for this context
  const sshKey = await getOrCreateGitHubKey(trx, context);
  const keyTitle = `StrapYard: ${userSource} - ${user}`;

  // Now, save the key to the provider (e.g., send it to DigitalOcean)
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
    method: "post",
    body: {
      name: keyTitle,
      public_key: sshKey.publicKey,
    },
    skipCache: true,
  });

  let sshKeySourceId: string;

  if (digitalOceanResponse.message) {
    log.error("Error sending SSH key to DigitalOcean", {
      digitalOceanResponse,
    });
    if (!digitalOceanResponse.message.includes("SSH Key is already in use")) {
      throw new Error(`Unknown error sending key to DigitalOcean`);
    }
    // Grab the ID from DigitalOcean
    const digitalOceanFetchKeyResponse = await digitalOceanApi<{
      message?: string;
      ssh_key: {
        id: number;
        fingerprint: string;
        public_key: string;
        name: string;
      };
    }>({
      path: `account/keys/${sshKey.fingerprint}`,
      method: "get",
      expectStatus: 200,
    });
    if (!digitalOceanFetchKeyResponse.ssh_key) {
      log.error("Couldn't find an extant key in DigitalOcean...", {
        digitalOceanFetchKeyResponse,
      });
      throw new Error(`Error adding key to provider...`);
    }
    sshKeySourceId = digitalOceanFetchKeyResponse.ssh_key.id.toString();
  } else {
    sshKeySourceId = digitalOceanResponse.ssh_key.id.toString();
    log.debug("Key sent to DigitalOcean", { keyTitle, digitalOceanResponse });
  }

  // Save the provider SSH key to the StrapYard DB (so we don't do all of
  // the above junk more than once
  return providerSSHKey.create(trx, {
    user: context.user.email,
    userSource: context.user.source,
    source: "digital_ocean",
    sourceId: sshKeySourceId,
    sshKeyId: sshKey.id,
  });
}
