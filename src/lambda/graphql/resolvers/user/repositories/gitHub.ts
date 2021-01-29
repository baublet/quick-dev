import {
  getCurrentUserRepos,
  GitHubRepo,
} from "../../../../common/gitHub/getCurrentUserRepos";
import { Context } from "../../../../common/context";

export async function gitHub(
  _parent: Context["user"],
  {
    input,
  }: {
    input?: {
      perPage?: number;
      page?: number;
    };
  } = { input: {} },
  context: Context
): Promise<{
  totalCount?: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nodes: GitHubRepo[];
}> {
  return getCurrentUserRepos(context, {
    page: input?.page,
    perPage: input?.perPage,
  });
}
