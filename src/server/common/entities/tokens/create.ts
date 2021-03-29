import { ulid } from "ulid";

import { Token } from "./index";
import { Transaction } from "../../db";

// 30 days
const defaultExpiry = 1000 * 60 * 60 * 24 * 30;

export async function create(
  trx: Transaction,
  expiresAfterMs: number = defaultExpiry
): Promise<Token> {
  const expires = new Date(Date.now() + expiresAfterMs);

  const result = await trx<Token>("tokens")
    .insert({
      id: ulid(),
      token: ulid(),
      expires,
    })
    .returning("*");

  return result[0];
}
