import { Token } from "./index";
import { Transaction } from "../db";

// 30 days
const defaultExpiry = 1000 * 60 * 60 * 24 * 30;

export async function create(
  trx: Transaction,
  expiresAfterMs: number = defaultExpiry
): Promise<Token> {
  const expires = new Date(Date.now() + expiresAfterMs);
  const createdIds = await trx<Token>("tokens").insert({
    expires,
  });

  const createdTokens = await trx<Token>("tokens")
    .select()
    .where({ id: createdIds[0] });
  return createdTokens[0];
}
