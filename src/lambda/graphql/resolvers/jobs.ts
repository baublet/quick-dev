import { Context } from "../../common/context";
import { get as getJobs } from "../../common/jobs";
import { JobConnection } from "../generated";

export async function jobs(
  _parent: unknown,
  _args: unknown,
  context: Context
): Promise<JobConnection> {
  const jobs = await getJobs(context.db);

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
