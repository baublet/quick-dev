import { getCurrentUser } from "../gitHub";
import { getDatabaseConnection, Connection } from "../../common/db";
import { serviceHandler } from "./serviceHandler";
import { createCache, Caches } from "./cache";
import { UserAccount } from "../entities/userAccount";
import { User } from "../entities/user";
import { getCurrentUserFromAccessToken } from "./getCurrentUserFromAccessToken";

export type UserSource = "github";

export interface ContextUser {
  user: User;
  userAccounts: UserAccount[];
}

export interface Context {
  user: ContextUser | null;
  getUserOrFail: () => ContextUser;
  db: Connection;
  service: ReturnType<typeof serviceHandler>;
  accessToken?: string;
  cache: Caches;
  requestId: string;
}

export interface ContextWithUser extends Context {
  user: ContextUser;
}

/**
 * Creates a context outside of the lambda event. Useful for robots and things
 * that happen outside of GraphQL
 */
export async function createContext({
  accessToken,
  requestId,
}: {
  accessToken?: string;
  requestId: string;
}) {
  const context: Partial<Context> = {};

  context.db = getDatabaseConnection();
  context.service = serviceHandler(context as Context);
  context.cache = createCache();
  context.accessToken = accessToken;
  context.requestId = requestId;

  const user = await getCurrentUserFromAccessToken(context as Context);
  context.user = user;

  context.getUserOrFail = () => {
    if (context.user) {
      return context.user;
    }
    throw new Error("Unauthorized");
  };

  return context as Context;
}
