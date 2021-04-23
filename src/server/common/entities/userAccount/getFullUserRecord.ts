import { UserAccount } from "./index";
import { User, getByIdOrFail } from "../user";
import { ConnectionOrTransaction } from "../../db";

export async function getFullUserRecord(
  trx: ConnectionOrTransaction,
  identifier: {
    source: UserAccount["source"];
    sourceId: string;
  }
): Promise<{ user: User; userAccounts: UserAccount[] } | undefined> {
  const query = trx<UserAccount>("userAccounts")
    .select("userId")
    .where("source", "=", identifier.source)
    .andWhere("sourceId", "=", identifier.sourceId)
    .limit(1);

  const found = await query;

  if (found.length === 0) {
    return undefined;
  }

  const [user, userAccounts] = await Promise.all([
    getByIdOrFail(trx, found[0].userId),
    trx<UserAccount>("userAccounts")
      .select("*")
      .where("userId", "=", found[0].userId)
      .limit(1),
  ]);

  return {
    user,
    userAccounts,
  };
}
