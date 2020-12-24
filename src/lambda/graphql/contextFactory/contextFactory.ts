import { APIGatewayEvent } from "aws-lambda";

import { loadGitHubUser } from "./loadGitHubUser";
import { Context, ContextUser } from "./";
import { getDatabaseConnection } from "../../common/db";

export async function contextFactory({
  event,
}: {
  event: APIGatewayEvent;
}): Promise<Context> {
  const authorizationToken = event.headers.authorization;
  const tokenScope = event.headers.scope;

  let user: ContextUser | null = null;
  if (authorizationToken) {
    const tokenParts = authorizationToken.split(" ");
    const githubUser = await loadGitHubUser({
      scope: tokenScope,
      tokenType: tokenParts[0],
      accessToken: authorizationToken[1],
    });
    if (githubUser) {
      user = githubUser;
    }
  }

  const db = getDatabaseConnection();

  const transaction = await db.transaction();
  return { user, transaction };
}
