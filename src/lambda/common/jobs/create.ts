import { Job } from "./index";
import { Transaction } from "../db";

type CreateJobInput<
  T extends Record<string, string | number | boolean> = any
> = Pick<Job, "name"> & {
  payload?: T;
};

export async function create<
  T extends Record<string, string | number | boolean>
>(
  { name, payload = {} as T }: CreateJobInput<T>,
  trx: Transaction
): Promise<Job> {
  const payloadString = JSON.stringify(payload);
  const createdJobIds = await trx<Job>("jobs").insert({
    name,
    payload: payloadString,
  });

  const id = createdJobIds[0];

  const found = await trx<Job>("jobs").select().where(id);
  return found[0];
}
