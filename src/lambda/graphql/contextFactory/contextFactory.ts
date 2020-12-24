import { APIGatewayEvent } from "aws-lambda";
import cookie from "cookie";

import { loadGitHubUser } from "./loadGitHubUser";
import { Context, ContextUser } from "./";
import { getDatabaseConnection } from "../../common/db";
import { serviceHandler } from "./serviceHandler";

export async function contextFactory({
  event,
}: {
  event: APIGatewayEvent;
}): Promise<Context> {
  const cookies = cookie.parse(event.headers.cookie);
  const authorizationToken = cookies.auth;

  let user: ContextUser | null = null;
  if (authorizationToken) {
    const tokenParts = authorizationToken.split(" ");
    const githubUser = await loadGitHubUser({
      scope: "user",
      tokenType: tokenParts[0],
      accessToken: tokenParts[1],
    });
    if (githubUser) {
      user = githubUser;
    }
  }

  const context: Partial<Context> = {};

  context.user = user;
  context.db = getDatabaseConnection();
  context.service = serviceHandler(context as Context);

  return context as Context;
}
