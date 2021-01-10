import { ulid } from "ulid";

import { ProviderSSHKey } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateSSHKeyInput = Pick<
  ProviderSSHKey,
  "user" | "userSource" | "source" | "sourceId" | "sshKeyId"
>;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateSSHKeyInput
): Promise<ProviderSSHKey> {
  const created = await trx<ProviderSSHKey>("providerSSHKeys")
    .insert({ ...input, id: ulid() })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
