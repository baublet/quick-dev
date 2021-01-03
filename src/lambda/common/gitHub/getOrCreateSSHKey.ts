import { createSSHKeyPair } from "../createSSHKeyPair";
import { create as createKey, SSHKey, getByUser } from "../sshKey";
import { ConnectionOrTransaction } from "../../common/db";
import { Context } from "../context";
import { saveSSHKey } from "./saveSSHKey";

export async function getOrCreateSSHKey(
  trx: ConnectionOrTransaction,
  context: Context
): Promise<SSHKey> {
  const extant = await getByUser(trx, context.user.email, context.user.source);
  if (extant) {
    // TODO: check that the key exists in their github. If it does, return this one, otherwise,
    // we need to delete this one and create a new one.
    return extant;
  }

  const keyTitle = `StrapYard: ${context.user.email}`;
  const sshKey = await createSSHKeyPair(context.user.email);

  const persistedKey = await createKey(trx, {
    userSource: context.user.source,
    user: context.user.email,
    fingerprint: sshKey.fingerprint,
    privateKey: sshKey.privateKey,
    publicKey: sshKey.publicKey,
  });

  // Send it to GitHub
  await saveSSHKey(context, sshKey.publicKey, keyTitle);

  return persistedKey;
}
