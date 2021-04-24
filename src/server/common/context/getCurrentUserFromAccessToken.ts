import { log } from "../../../common/logger";
import { UserAccount, User, user, userAccount } from "../entities";
import { getCurrentUser } from "../gitHub";
import { Context } from "./createContext";

export async function getCurrentUserFromAccessToken(
  context: Pick<Context, "cache" | "accessToken" | "db">
): Promise<{ user: User; userAccounts: UserAccount[] } | undefined> {
  const githubUser = await getCurrentUser(context);

  if (!githubUser) {
    log.debug(
      "No GitHub user found correlating to access token. Not authenticated..."
    );
    return undefined;
  }

  const record = await userAccount.getFullUserRecord(context.db, {
    source: "github",
    uniqueIdentifier: githubUser.id,
  });

  if (record) {
    log.debug("User exists. No need to create new user record");
    return record;
  }

  // User is new! Create them
  log.info("User is new! Creating them in the database...");
  const newUser = await user.create(context.db);
  const newAccount = await userAccount.create(context.db, {
    source: "github",
    userId: newUser.id,
    uniqueIdentifier: githubUser.id,
    rawUserData: githubUser,
  });

  return {
    user: newUser,
    userAccounts: [newAccount],
  };
}
