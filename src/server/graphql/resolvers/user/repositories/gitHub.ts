import {
  getCurrentUserRepos,
  GitHubRepo,
} from "../../../../common/gitHub/getCurrentUserRepos";
import { repositories } from "../../../../common/entities";
import {
  UserRepositoryInputFilters,
  PaginationInput,
} from "../../../generated";
import { Context } from "../../../../common/context";

export async function gitHub(
  _parent: Context["user"],
  {
    pageOptions,
    filter,
  }: {
    pageOptions?: PaginationInput;
    filter?: UserRepositoryInputFilters;
  } = { pageOptions: {} },
  context: Context
): Promise<{
  totalCount?: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nodes: GitHubRepo[];
}> {
  if (filter?.popular) {
    const popularRepositories = await repositories.getPopularRepositories(
      context.db,
      context.getUserOrFail().user.id
    );
    return {
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      nodes: popularRepositories,
      totalCount: popularRepositories.length,
    };
  }
  return getCurrentUserRepos(context, {
    page: pageOptions?.page || undefined,
    perPage: pageOptions?.perPage || undefined,
  });
}
