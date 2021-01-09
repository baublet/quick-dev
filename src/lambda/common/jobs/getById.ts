import { IntermediateJob } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getById(
  trx: ConnectionOrTransaction,
  id: string,
  props: (keyof IntermediateJob)[] | "*" = "*"
): Promise<IntermediateJob | undefined> {
  const found = await trx<IntermediateJob>("jobs")
    .select(props)
    .where("id", "=", id)
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }
  return undefined;
}
