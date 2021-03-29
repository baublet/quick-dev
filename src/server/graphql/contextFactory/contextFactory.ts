import { Request } from "express";
import { ulid } from "ulid";

import { createContext, Context } from "../../common/context";

export async function contextFactory({
  req: request,
}: {
  req: Request;
}): Promise<Context> {
  try {
    const accessToken = request.cookies?.auth || undefined;
    return createContext({ accessToken, requestId: ulid() });
  } catch (e) {
    console.error({
      message: e.message,
      stackTrace: e.stack,
    });
    throw new Error(e);
  }
}
