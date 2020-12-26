import { Environment, EnvironmentUserSource } from "./index";
import { ConnectionOrTransaction } from "../db";

type GetEnvironmentsInput = {
  user: string;
  userSource: EnvironmentUserSource;
  page?: number;
  perPage?: number;
};

export async function get(
  trx: ConnectionOrTransaction,
  { user, userSource, page = 1, perPage = 10 }: GetEnvironmentsInput
): Promise<Environment[]> {
  return trx<Environment>("environments")
    .select()
    .where({ user, userSource })
    .orderBy("updated_at", "asc")
    .limit(perPage)
    .offset((page - 1) * perPage);
}
