import { EnvironmentDomainRecord } from "./index";
import { ConnectionOrTransaction } from "../db";

export async function getByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: string,
  props: (keyof EnvironmentDomainRecord)[] | "*" = "*"
): Promise<EnvironmentDomainRecord[]> {
  return trx<EnvironmentDomainRecord>("environmentDomainRecords")
    .select(props)
    .where("environmentId", "=", environmentId);
}
