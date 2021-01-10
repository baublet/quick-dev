import { Context } from "../../common/context";
import { job } from "../../common/entities";
import { JobConnection } from "../generated";

export async function jobs(
  _parent: unknown,
  _args: unknown,
  context: Context
): Promise<JobConnection> {
  const jobs = await job.get(context.db);

  if (!jobs.length) {
    return {
      edges: [],
    };
  }

  return {
    edges: [
      {
        cursor: jobs[jobs.length - 1].id,
        nodes: jobs,
      },
    ],
  };
}
