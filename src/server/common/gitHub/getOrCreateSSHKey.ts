import { createSSHKeyPair } from "../createSSHKeyPair";
import { sshKey, SSHKey, userAccount } from "../entities";
import { ConnectionOrTransaction } from "../../common/db";
import { Context } from "../context";
import { saveSSHKey } from "./saveSSHKey";
import { unauthorized } from "../../graphql/common/unauthorized";
import { unauthorizedError } from "../../graphql/common/unauthorizedError";

export async function getOrCreateSSHKey(
  trx: ConnectionOrTransaction,
  context: Context
): Promise<SSHKey> {
  if (!unauthorized(context)) {
    throw unauthorizedError(context);
  }

  const userRecord = context.getUserOrFail().user;
  const extant = await sshKey.getByUser(trx, userRecord.id);
  if (extant) {
    // TODO: check that the key exists in their github. If it does, return this one, otherwise,
    // we need to delete this one and create a new one.
    return extant;
  }

  const email = userAccount.getEmailFromUserAccountRecordsOrThrow(
    context.getUserOrFail().userAccounts
  );
  const keyTitle = `StrapYard Key: ${email}`;
  const foundKey = await createSSHKeyPair(email);

  const persistedKey = await sshKey.create(trx, {
    userId: userRecord.id,
    fingerprint: foundKey.fingerprint,
    privateKey: foundKey.privateKey,
    publicKey: foundKey.publicKey,
  });

  // Send it to GitHub
  await saveSSHKey(context, foundKey.publicKey, keyTitle);

  return persistedKey;
}
