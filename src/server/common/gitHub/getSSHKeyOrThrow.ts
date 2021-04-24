import { EnvironmentUserSource, sshKey, SSHKey } from "../entities";
import { ConnectionOrTransaction } from "../../common/db";

export async function getSSHKeyOrThrow(
  trx: ConnectionOrTransaction,
  userId: string
): Promise<SSHKey> {
  const extant = await sshKey.getByUser(trx, userId);
  if (extant) {
    return extant;
  }

  throw new Error(`GitHub SSH key not yet created... has the user logged in?`);
}
