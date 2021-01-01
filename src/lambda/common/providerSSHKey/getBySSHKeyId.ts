import { ProviderSSHKey } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getBySSHKeyId(
  trx: ConnectionOrTransaction,
  sshKeyId: number
): Promise<ProviderSSHKey | undefined> {
  const found = await trx<ProviderSSHKey>("providerSSHKeys")
    .select()
    .where("sshKeyId", "=", sshKeyId)
    .limit(1);
  if (!found.length) {
    return undefined;
  }
  return found[0];
}
