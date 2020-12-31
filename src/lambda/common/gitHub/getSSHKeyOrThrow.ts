import { EnvironmentUserSource } from "../environment";
import { SSHKey, getByUser } from "../sshKey";
import { ConnectionOrTransaction } from "../../common/db";

export async function getSSHKeyOrThrow(
  trx: ConnectionOrTransaction,
  user: string,
  userSource: EnvironmentUserSource
): Promise<SSHKey> {
  const extant = await getByUser(trx, user, userSource);
  if (extant) {
    return extant;
  }

  throw new Error(`GitHub SSH key not yet created... has the user logged in?`);
}
