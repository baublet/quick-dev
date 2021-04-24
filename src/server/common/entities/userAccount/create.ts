import { ulid } from "ulid";

import { UserAccount } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function create(
  trx: ConnectionOrTransaction,
  input: Partial<
    Pick<
      UserAccount,
      "rawUserData" | "source" | "sourceId" | "uniqueIdentifier" | "userId"
    >
  >
): Promise<UserAccount> {
  const created = await trx<UserAccount>("userAccounts")
    .insert({ ...input, id: ulid() })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
  throw new Error(
    `Unexpected error creating environment! DB invariance violation`
  );
}
