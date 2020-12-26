import {
  getCurrentUserRepos,
  GitHubRepo,
} from "../../../../common/gitHub/getCurrentUserRepos";
import { Context } from "../../../../common/context";

export async function gitHub(
  _parent: Context["user"],
  {
    input: { page = 1, perPage = 25 },
  }: {
    input: {
      perPage: number;
      page: number;
    };
  },
  context: Context
): Promise<{
  totalPages?: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nodes: GitHubRepo[];
}> {
  return getCurrentUserRepos(context, { page, perPage });
}
