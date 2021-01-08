import { Environment } from "./index";
import { ConnectionOrTransaction } from "../db";

type CreateEnvironmentInput = Partial<Environment> &
  Pick<
    Environment,
    | "name"
    | "repositoryUrl"
    | "secret"
    | "sshKeyId"
    | "strapYardFile" // Raw file
    | "subdomain"
    | "user"
    | "userSource"
  >;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentInput
): Promise<Environment> {
  const created = await trx<Environment>("environments")
    .insert(input)
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
}
