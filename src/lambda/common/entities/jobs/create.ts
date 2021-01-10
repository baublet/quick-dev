import { ulid } from "ulid";

import { IntermediateJob, Job } from "./index";
import { ConnectionOrTransaction } from "../../db";

type CreateJobInput<
  T extends Record<string, string | number | boolean> = any
> = Pick<Job, "type"> & {
  payload?: T;
};

export async function create<
  T extends Record<string, string | number | boolean>
>(
  trx: ConnectionOrTransaction,
  { type, payload = {} as T }: CreateJobInput<T>
): Promise<IntermediateJob> {
  const payloadString = JSON.stringify(payload);
  const created = await trx<IntermediateJob>("jobs")
    .insert({
      type,
      id: ulid(),
      payload: payloadString,
      status: "ready",
      history: "[]",
    })
    .returning("*");

  if (created.length > 0) {
    return created[0];
  }
}
