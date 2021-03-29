import { getCurrentUser } from "../gitHub";
import { getDatabaseConnection, Connection } from "../../common/db";
import { serviceHandler } from "./serviceHandler";
import { createCache, Caches } from "./cache";

export type UserSource = "github";

export interface ContextUser {
  id: string;
  avatar: string;
  name: string;
  email: string;
  source: UserSource;
}

export interface Context {
  user: ContextUser | null;
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

  let user: ContextUser | null = null;
  if (accessToken) {
    const githubUser = await getCurrentUser(context as Context);
    if (githubUser) {
      user = {
        ...githubUser,
        source: "github",
      };
    }
  }

  context.user = user;
  return context as Context;
}
