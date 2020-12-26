import { APIGatewayEvent } from "aws-lambda";
import cookie from "cookie";
import { ulid } from "ulid";

import { createContext, Context } from "../../common/context";

export async function contextFactory({
  event,
}: {
  event: APIGatewayEvent;
}): Promise<Context> {
  try {
    const cookies = cookie.parse(event.headers.cookie || "");
    const accessToken = cookies.auth || undefined;

    return createContext({ accessToken, requestId: ulid() });
  } catch (e) {
    console.error({
      message: e.message,
      stackTrace: e.stack,
    });
    throw new Error(e);
  }
}
