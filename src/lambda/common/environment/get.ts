import { Environment, EnvironmentUserSource } from "./index";
import { ConnectionOrTransaction } from "../db";

type GetEnvironmentsInput = {
  user: string;
  userSource?: EnvironmentUserSource;
  page?: number;
  perPage?: number;
};

export async function get(
  trx: ConnectionOrTransaction,
  { user, userSource, page = 1, perPage = 10 }: GetEnvironmentsInput
): Promise<Environment[]> {
  const query = trx<Environment>("environments")
    .select()
    .orderBy("updated_at", "asc")
    .limit(perPage)
    .offset((page - 1) * perPage);

  if (user) query.where({ user });
  if (userSource) query.where({ userSource });

  return query;
}
