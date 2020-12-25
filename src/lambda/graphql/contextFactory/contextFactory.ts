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
  try {
    const cookies = cookie.parse(event.headers.cookie || "");
    const authorizationToken = cookies.auth;
    const context: Partial<Context> = {};

    let user: ContextUser | null = null;
    if (authorizationToken) {
      const tokenParts = authorizationToken.split(" ");
      const githubUser = await loadGitHubUser({
        scope: "user",
        tokenType: "bearer",
        accessToken: tokenParts[1],
      });
      context.authorizationToken = tokenParts[1];
      if (githubUser) {
        user = githubUser;
      }
    }

    context.user = user;
    context.db = getDatabaseConnection();
    context.service = serviceHandler(context as Context);

    return context as Context;
  } catch (e) {
    console.error({
      message: e.message,
      stackTrace: e.stack,
    });
    throw new Error(e);
  }
}
