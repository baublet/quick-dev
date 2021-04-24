import { log } from "../../../../common/logger";
import { UserAccount } from "./index";

export function getNameFromUserAccountRecordsOrThrow(
  userAccounts: UserAccount[]
): string {
  const found = userAccounts
    .map((account) => account.rawUserData.name)
    .find((name) => Boolean(name));
  if (!found) {
    log.error("User has no name associated with any account!", {
      userAccounts,
    });
    throw new Error("User has no name associated with any account!");
  }
  return found;
}
