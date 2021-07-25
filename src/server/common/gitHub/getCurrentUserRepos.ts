import { Context } from "../context";
import { githubApi } from "./githubApi";

interface GitHubRepoResponse {
  id: number;
  full_name: string;
  private: boolean;
  url: string;
  git_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  private: boolean;
  htmlUrl: string;
  gitUrl: string;
}

export async function getCurrentUserRepos(
  context: Context,
  {
    page = 1,
    perPage = 10,
  }: {
    page?: number;
    perPage?: number;
  }
): Promise<{
  totalCount?: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nodes: GitHubRepo[];
}> {
  if (!context.accessToken) {
    throw new Error("Not authorized");
  }

  const cacheKey = `${context.accessToken}-${page}-${perPage}`;
  const gitHubUserReposCache = context.cache.gitHubUserReposCache;
  const hasPreviousPage = page > 1;

  const userRepos = await gitHubUserReposCache.get(cacheKey);
  if (!userRepos) {
    const fetchResponse = await githubApi<GitHubRepoResponse[]>({
      path: `user/repos?per_page=${perPage + 1}&page=${page}`,
      accessToken: context.accessToken,
    });

    const fetchedRepos = fetchResponse.map((repo) => ({
      id: `${repo.id}`,
      name: repo.full_name,
      private: repo.private,
      htmlUrl: repo.html_url,
      gitUrl: repo.git_url,
    }));

    const hasNextPage = fetchedRepos.length > perPage;

    if (hasNextPage) {
      fetchedRepos.pop();
    }

    gitHubUserReposCache.set(cacheKey, {
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      nodes: fetchedRepos,
    });
    return {
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      nodes: fetchedRepos,
    };
  }

  return userRepos;
}
