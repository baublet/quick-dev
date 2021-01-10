import { EnvironmentDomainRecord } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function del(
  trx: ConnectionOrTransaction,
  id: EnvironmentDomainRecord["id"]
): Promise<EnvironmentDomainRecord> {
  await trx<EnvironmentDomainRecord>("environmentDomainRecords")
    .update({ deleted: true })
    .where({ id })
    .limit(1);
  const freshRows = trx<EnvironmentDomainRecord>("environmentDomainRecords")
    .select({ id })
    .limit(1);
  return freshRows[0];
}
