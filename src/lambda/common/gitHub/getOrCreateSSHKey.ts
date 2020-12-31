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
    return extant;
  }

  const keyTitle = `StrapYard: ${context.user.email}`;
  const sshKey = await createSSHKeyPair(context.user.email);

  const persistedKey = await createKey(trx, {
    userSource: context.user.source,
    user: context.user.email,
    privateKey: sshKey.privateKey,
    publicKey: sshKey.publicKey,
  });

  // Send it to GitHub
  await saveSSHKey(context, sshKey.publicKey, keyTitle);

  return persistedKey;
}
