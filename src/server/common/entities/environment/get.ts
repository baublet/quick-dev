import { Environment, EnvironmentUserSource } from "./index";
import { ConnectionOrTransaction } from "../../db";

type GetEnvironmentsInput = {
  user: string;
  userSource?: EnvironmentUserSource;
  page?: number;
  perPage?: number;
  deleted?: boolean;
};

export async function get(
  trx: ConnectionOrTransaction,
  {
    user,
    userSource,
    page = 1,
    perPage = 10,
    deleted = false,
  }: GetEnvironmentsInput
): Promise<Environment[]> {
  const query = trx<Environment>("environments")
    .select()
    .orderBy("updated_at", "asc")
    .limit(perPage)
    .where("deleted", "=", deleted)
    .offset((page - 1) * perPage);

  if (user) query.andWhere({ user });
  if (userSource) query.andWhere({ userSource });

  return query;
}
