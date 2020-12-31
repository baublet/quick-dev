import { ProviderSSHKey } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateSSHKeyInput = Pick<
ProviderSSHKey,
  "user" | "userSource" | "source" | "sourceId" | "sshKeyId">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateSSHKeyInput
): Promise<ProviderSSHKey> {
  const createdIds = await trx<ProviderSSHKey>("providerSSHKeys").insert(input);
  const id = createdIds[0];
  const found = await trx<ProviderSSHKey>("providerSSHKeys").select().where("id", "=", id);
  return found[0];
}
