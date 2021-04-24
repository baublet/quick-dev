import { ProviderSSHKey } from "./index";
import { ConnectionOrTransaction } from "../../db";

type UpdateSSHKeyInput = Partial<Pick<ProviderSSHKey, "sourceId" | "sshKeyId">>;

export async function update(
  trx: ConnectionOrTransaction,
  id: string,
  input: UpdateSSHKeyInput
) {
  const created = await trx<ProviderSSHKey>("providerSSHKeys")
    .update({ ...input })
    .where("id", "=", id)
    .returning("*");
  return created[0];
}
