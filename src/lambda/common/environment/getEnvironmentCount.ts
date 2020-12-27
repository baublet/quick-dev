import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

type GetEnvironmentsInput = {
  user: string;
};

export async function getEnvironmentCount(
  trx: ConnectionOrTransaction,
  { user }: GetEnvironmentsInput
): Promise<number> {
  const result = await trx<Environment>("environments")
    .where({ user })
    .count("id", { as: "count" });

  return result[0].count as number;
}
