import { APIGatewayEvent } from "aws-lambda";

import { loadGitHubUser } from "./loadGitHubUser";
import { Context, ContextUser } from "./";
import { getDatabaseConnection } from "../../common/db";
import { serviceHandler } from "../../../common/serviceHandler";

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

  const context: Partial<Context> = {};

  context.user = user;
  context.db = getDatabaseConnection();
  context.service = serviceHandler(context as Context);

  return context as Context;
}
