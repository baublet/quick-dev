import { IntermediateJob, Job } from "./index";
import { ConnectionOrTransaction } from "../db";

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
): Promise<Job> {
  const payloadString = JSON.stringify(payload);
  const createdJobIds = await trx<IntermediateJob>("jobs").insert({
    type,
    payload: payloadString,
  });

  const id = createdJobIds[0];

  const found = await trx<Job>("jobs").select().where(id);
  return found[0];
}
