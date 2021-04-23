import { UserAccount, User, user, userAccount } from "../entities";
import { getCurrentUser } from "../gitHub";
import { Context } from "./createContext";

export async function getCurrentUserFromAccessToken(
  context: Pick<Context, "cache" | "accessToken" | "db">
): Promise<{ user: User; userAccounts: UserAccount[] } | undefined> {
  const githubUser = await getCurrentUser(context);

  if (!githubUser) {
    return undefined;
  }

  const record = await userAccount.getFullUserRecord(context.db, {
    source: "github",
    sourceId: githubUser.id,
  });

  if (record) {
    return record;
  }

  // User is new! Create them
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
