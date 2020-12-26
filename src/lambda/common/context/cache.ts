import { createCache, SimpleCache } from "../../../common/simpleCache";
import { GitHubUser, GitHubRepo } from "../gitHub";

declare global {
  module NodeJS {
    interface Global {
      globalCache: {
        gitHubUserCache: SimpleCache<GitHubUser>;
        gitHubUserReposCache: SimpleCache<{
          currentPage: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          nodes: GitHubRepo[];
        }>;
        gitHubRepoCache: SimpleCache<GitHubRepo>;
      };
    }
  }
}

export function cache() {
  global.globalCache = global.globalCache || ({} as any);
  global.globalCache.gitHubUserReposCache =
    global.globalCache.gitHubUserReposCache || createCache({}, 1000 * 60);
  global.globalCache.gitHubRepoCache =
    global.globalCache.gitHubRepoCache || createCache({}, 1000 * 60 * 5);
  global.globalCache.gitHubUserCache =
    global.globalCache.gitHubUserCache || createCache({}, 1000 * 60 * 5);

  return {
    gitHubUserCache: global.globalCache.gitHubUserCache,
    gitHubUserReposCache: global.globalCache.gitHubUserReposCache,
    gitHubRepoCache: global.globalCache.gitHubRepoCache,
  };
}
