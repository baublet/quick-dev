import { createSSHKeyPair } from "../createSSHKeyPair";
import { sshKey, SSHKey } from "../entities";
import { ConnectionOrTransaction } from "../../common/db";
import { Context } from "../context";
import { saveSSHKey } from "./saveSSHKey";

export async function getOrCreateSSHKey(
  trx: ConnectionOrTransaction,
  context: Context
): Promise<SSHKey> {
  const extant = await sshKey.getByUser(
    trx,
    context.user.email,
    context.user.source
  );
  if (extant) {
    // TODO: check that the key exists in their github. If it does, return this one, otherwise,
    // we need to delete this one and create a new one.
    return extant;
  }

  const keyTitle = `StrapYard: ${context.user.email}`;
  const foundKey = await createSSHKeyPair(context.user.email);

  const persistedKey = await sshKey.create(trx, {
    userSource: context.user.source,
    user: context.user.email,
    fingerprint: foundKey.fingerprint,
    privateKey: foundKey.privateKey,
    publicKey: foundKey.publicKey,
  });

  // Send it to GitHub
  await saveSSHKey(context, foundKey.publicKey, keyTitle);

  return persistedKey;
}
