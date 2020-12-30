import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getBySecret(
  trx: ConnectionOrTransaction,
  secret: string,
  props: (keyof Environment)[] | "*" = "*"
): Promise<Environment | undefined> {
  const found = await trx<Environment>("environments")
    .select(props)
    .where("secret", "=", secret)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
