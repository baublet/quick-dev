import { ulid } from "ulid";

import { ProviderSSHKey } from "./index";
import { ConnectionOrTransaction } from "../../db";

type CreateSSHKeyInput = Pick<
  ProviderSSHKey,
  "userId" | "source" | "sourceId" | "sshKeyId"
>;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateSSHKeyInput
) {
  const created = await trx<ProviderSSHKey>("providerSSHKeys")
    .insert({ ...input, id: ulid() })
    .returning("*");
  return created[0];
}
