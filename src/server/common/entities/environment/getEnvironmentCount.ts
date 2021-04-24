import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

type GetEnvironmentsInput = {
  userId: string;
};

export async function getEnvironmentCount(
  trx: ConnectionOrTransaction,
  { userId }: GetEnvironmentsInput
): Promise<number> {
  const result = await trx<Environment>("environments")
    .where({ userId })
    .andWhere("deleted", "=", false)
    .count("id", { as: "count" });

  return result[0].count as number;
}
