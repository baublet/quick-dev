import { IntermediateJob } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function get(
  trx: ConnectionOrTransaction,
  _options?: unknown,
  props: (keyof IntermediateJob)[] | "*" = "*"
): Promise<IntermediateJob[]> {
  return trx<IntermediateJob>("jobs").select(props);
}
