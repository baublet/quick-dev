import { SSHKey } from "./index";
import { ConnectionOrTransaction } from "../db";
import { log } from "../../../common/logger";

export async function getById(
  trx: ConnectionOrTransaction,
  id: number,
  props: (keyof SSHKey)[] | "*" = "*"
): Promise<SSHKey | undefined> {
  log.info("SSH KEY GET BY ID: ", { id, type: typeof id });
  const found = await trx<SSHKey>("sshKeys")
    .select(props)
    .where("id", "=", id)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
