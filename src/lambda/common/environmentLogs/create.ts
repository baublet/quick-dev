import { EnvironmentLog } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentInput = Partial<EnvironmentLog> &
  Pick<
  EnvironmentLog,
    "environmentId" | "log"
  >;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentInput
): Promise<EnvironmentLog> {
  const createdIds = await trx<EnvironmentLog>("environmentLogs").insert(input);
  const id = createdIds[0];
  const found = await trx<EnvironmentLog>("environmentLogs")
    .select()
    .where("id", "=", id);
  return found[0];
}
