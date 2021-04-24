import { log } from "../../../../common/logger";
import { UserAccount } from "./index";

export function getEmailFromUserAccountRecordsOrThrow(
  userAccounts: UserAccount[]
): string {
  const found = userAccounts
    .map((account) => account.rawUserData.email)
    .find((email) => Boolean(email));
  if (!found) {
    log.error("User has no email associated with any account!", {
      userAccounts,
    });
    throw new Error("User has no email associated with any account!");
  }
  return found;
}
