import { githubApi } from "../../../common/githubApi";
import { Context } from "../../contextFactory";

import { createCache } from "../../../../common/simpleCache";

declare global {
  module NodeJS {
    interface Global {
      gitHubUserReposCache: ReturnType<typeof createCache>;
    }
  }
}

global.gitHubUserReposCache =
  global.gitHubUserReposCache || createCache({}, 1000 * 60);
const gitHubUserReposCache = global.gitHubUserReposCache;

interface GitHubRepoResponse {
  id: number;
  full_name: string;
  private: boolean;
  url: string;
  git_url: string;
}

interface GitHubRepo {
  id: string;
  name: string;
  private: boolean;
  htmlUrl: string;
  gitUrl: string;
}

export async function repositories(
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
  nodes: GitHubRepo[];
}> {
  if (!context.authorizationToken) {
    throw new Error("Not authorized");
  }

  const cacheKey = `${context.authorizationToken}-${page}-${perPage}`;
  console.log("Cache key: " + cacheKey);

  if (!gitHubUserReposCache.has(cacheKey)) {
    const fetchResponse = await githubApi<GitHubRepoResponse[]>({
      path: `user/repos?per_page=${perPage}&page=${page}`,
      accessToken: context.authorizationToken,
    });

    gitHubUserReposCache.set(cacheKey, {
      currentPage: page,
      nodes: fetchResponse.map((repo) => ({
        id: `${repo.id}`,
        name: repo.full_name,
        private: repo.private,
        htmlUrl: repo.url,
        gitUrl: repo.git_url,
      })),
    });
  }

  return gitHubUserReposCache.get(cacheKey);
}
