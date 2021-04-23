import { ulid } from "ulid";

import { Environment } from "./index";
import { ConnectionOrTransaction } from "../../db";

type CreateEnvironmentInput = Partial<Environment> &
  Pick<
    Environment,
    | "name"
    | "repositoryUrl"
    | "secret"
    | "sshKeyId"
    | "strapYardFile" // Raw file
    | "subdomain"
    | "userId"
  >;

export async function create(
  trx: ConnectionOrTransaction,
  input: CreateEnvironmentInput
): Promise<Environment> {
  const created = await trx<Environment>("environments")
    .insert({ ...input, id: ulid() })
    .returning("*");
  if (created.length > 0) {
    return created[0];
  }
  throw new Error(
    `Unexpected error creating environment! DB invariance violation`
  );
}
