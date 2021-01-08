import { SSHKey } from "./index";
import { ConnectionOrTransaction } from "../db";
import { log } from "../../../common/logger";

type CreateSSHKeyInput = Pick<
  SSHKey,
  "user" | "userSource" | "privateKey" | "publicKey" | "fingerprint"
>;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateSSHKeyInput
): Promise<SSHKey> {
  const created = await trx<SSHKey>("sshKeys").insert(input).returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
