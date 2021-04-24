import { Environment, EnvironmentUserSource } from "./index";
import { ConnectionOrTransaction } from "../../db";

type GetEnvironmentsInput = {
  userId: string;
  page?: number;
  perPage?: number;
  deleted?: boolean;
};

export async function get(
  trx: ConnectionOrTransaction,
  { userId, page = 1, perPage = 10, deleted = false }: GetEnvironmentsInput
): Promise<Environment[]> {
  const query = trx<Environment>("environments")
    .select()
    .orderBy("updated_at", "asc")
    .limit(perPage)
    .where("deleted", "=", deleted)
    .offset((page - 1) * perPage);

  if (userId) query.andWhere({ userId });

  return query;
}
