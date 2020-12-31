import { SSHKey } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateSSHKeyInput = Pick<
  SSHKey,
  "user" | "userSource" | "privateKey" | "publicKey">;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateSSHKeyInput
): Promise<SSHKey> {
  const createdIds = await trx<SSHKey>("sshKeys").insert(input);
  const id = createdIds[0];
  const found = await trx<SSHKey>("sshKeys").select().where("id", "=", id);
  return found[0];
}
