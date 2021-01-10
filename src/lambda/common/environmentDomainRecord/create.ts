import { ulid } from "ulid";

import { EnvironmentDomainRecord } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentInput = Partial<EnvironmentDomainRecord> &
  Pick<
    EnvironmentDomainRecord,
    "data" | "environmentId" | "type" | "provider" | "providerId"
  >;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentInput
): Promise<EnvironmentDomainRecord> {
  const created = await trx<EnvironmentDomainRecord>("environmentDomainRecords")
    .insert({ ...input, id: ulid() })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
