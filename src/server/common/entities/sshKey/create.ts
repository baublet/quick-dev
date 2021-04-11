import { ulid } from "ulid";

import { SSHKey } from "./index";
import { ConnectionOrTransaction } from "../../db";
import { log } from "../../../../common/logger";

type CreateSSHKeyInput = Pick<
  SSHKey,
  "user" | "userSource" | "privateKey" | "publicKey" | "fingerprint"
>;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateSSHKeyInput
) {
  const created = await trx<SSHKey>("sshKeys")
    .insert({ ...input, id: ulid() })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
  throw new Error("Unexpected error saving an SSH key!");
}
