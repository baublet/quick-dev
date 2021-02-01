import { ulid } from "ulid";

import { IntermediateJob, Job } from "./index";
import { ConnectionOrTransaction } from "../../db";

type CreateJobInput<
  T extends Record<string, string | number | boolean> = any
> = Pick<Job, "type"> & {
  payload?: T;
  startAfter: number;
  cancelAfter: number;
  retries?: number;
  retryDelaySeconds?: number;
};

export async function create<
  T extends Record<string, string | number | boolean>
>(
  trx: ConnectionOrTransaction,
  {
    type,
    startAfter,
    cancelAfter,
    retries = 2,
    retryDelaySeconds = 20,
    payload = {} as T,
  }: CreateJobInput<T>
): Promise<IntermediateJob | undefined> {
  const payloadString = JSON.stringify(payload);
  const created = await trx<IntermediateJob>("jobs")
    .insert({
      type,
      startAfter,
      cancelAfter,
      id: ulid(),
      retries,
      retriesRemaining: retries,
      retryDelaySeconds,
      payload: payloadString,
      status: "ready",
      history: "[]",
    })
    .returning("*");

  if (created.length > 0) {
    return created[0];
  }
}
