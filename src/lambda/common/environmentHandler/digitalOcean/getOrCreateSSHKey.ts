import { Environment } from "../../environment";
import {
  ProviderSSHKey,
  create as createProviderKey,
  get,
} from "../../providerSSHKey";
import { digitalOceanApi } from "./digitalOceanApi";
import { getOrCreateSSHKey as getOrCreateGitHubKey } from "../../gitHub";
import { Context } from "../../context";
import { log } from "../../../../common/logger";
import { ConnectionOrTransaction } from "../../db";

export async function getOrCreateSSHKey(
  trx: ConnectionOrTransaction,
  context: Context,
  environment: Environment
): Promise<ProviderSSHKey> {
  const { user, userSource, source } = environment;

  const extant = await get(trx, { user, userSource, source });
  if (extant) {
    return extant;
  }

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
    method: "post",
    body: {
      name: keyTitle,
      public_key: sshKey.publicKey,
    },
  });

  if (digitalOceanResponse.message) {
    log.error("Error sending SSH key to DigitalOcean", {
      digitalOceanResponse,
    });
    throw new Error(`Error sending key to DigitalOcean`);
  }

  // Save the provider SSH key to the StrapYard DB (so we don't do all of
  // the above junk more than once
  return createProviderKey(trx, {
    user: context.user.email,
    userSource: context.user.source,
    source: "digital_ocean",
    sourceId: digitalOceanResponse.ssh_key.id.toString(),
    sshKeyId: sshKey.id,
  });
}
