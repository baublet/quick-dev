import { Token } from "./index";
import { Transaction } from "../../db";

/**
 * Attempt to consume a token. Returns true if the token is valid and consumed.
 * Returns an error string if there's something wrong.
 */
export async function consume(
  trx: Transaction,
  token: string
): Promise<true | string> {
  const now = Date.now();
  const foundTokens = await trx<Token>("tokens").select().where({ token });

  if (foundTokens.length === 0) {
    return "Token not found";
  }

  const foundToken = foundTokens[0];

  if (foundToken.used) {
    return "Token already consumed";
  }

  if (now >= foundToken.expires.valueOf()) {
    return "Token expired";
  }

  await trx<Token>("tokens").update({ used: true }).where({ token }).limit(1);

  return true;
}
