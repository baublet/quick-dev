import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getBySubdomain(
  trx: ConnectionOrTransaction,
  subdomain: string,
  props: (keyof Environment)[] | "*" = "*"
): Promise<Environment | undefined> {
  const found = await trx<Environment>("environments")
    .select(props)
    .where("subdomain", "=", subdomain)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
