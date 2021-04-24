import { ulid } from "ulid";

import { EnvironmentCommandLog } from "./index";
import { ConnectionOrTransaction } from "../../db";

type CreateEnvironmentCommandInput = Partial<EnvironmentCommandLog> &
  Pick<
    EnvironmentCommandLog,
    "environmentCommandId" | "environmentId" | "logOutput"
  >;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentCommandInput
) {
  await trx<EnvironmentCommandLog>("environmentCommandLogs").insert({
    ...input,
    id: ulid(),
  });
}
