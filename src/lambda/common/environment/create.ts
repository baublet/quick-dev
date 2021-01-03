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
  const createdIds = await trx<Environment>("environments").insert(input);
  const id = createdIds[0];
  const found = await trx<Environment>("environments")
    .select()
    .where("id", "=", id);
  return found[0];
}
