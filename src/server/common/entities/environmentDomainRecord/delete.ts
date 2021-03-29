import { EnvironmentDomainRecord } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function del(
  trx: ConnectionOrTransaction,
  id: EnvironmentDomainRecord["id"]
) {
  await trx<EnvironmentDomainRecord>("environmentDomainRecords")
    .update({ deleted: true })
    .where("id", "=", id)
    .limit(1);
  const freshRows = await trx<EnvironmentDomainRecord>(
    "environmentDomainRecords"
  )
    .select("*")
    .where("id", "=", id)
    .limit(1);
  return freshRows[0];
}
