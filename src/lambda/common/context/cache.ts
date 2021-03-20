import { createCache, SimpleCache } from "../../../common/simpleCache";
import { GitHubUser, GitHubRepo } from "../gitHub";

type GlobalCache = {
  gitHubUserCache: SimpleCache<GitHubUser>;
  gitHubUserReposCache: SimpleCache<{
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nodes: GitHubRepo[];
  }>;
  gitHubRepoCache: SimpleCache<GitHubRepo>;
  environmentStartupLogsCache: SimpleCache<string>;
};

declare global {
  module NodeJS {
    interface Global {
      globalCache: GlobalCache;
    }
  }
}

function maybeSetCache<K extends keyof GlobalCache>(
  name: K,
  factory: () => SimpleCache<GlobalCache[K]>
) {
  global.globalCache = global.globalCache || ({} as any);
  global.globalCache[name] = global.globalCache[name] || factory();
}

export function cache() {
  maybeSetCache("gitHubUserReposCache", () => createCache({}, 1000 * 60));
  maybeSetCache("gitHubRepoCache", () => createCache({}, 1000 * 60 * 5));
  maybeSetCache("gitHubUserCache", () => createCache({}, 1000 * 60 * 5));
  maybeSetCache("environmentStartupLogsCache", () =>
    createCache({}, 1000 * 60 * 60 * 6)
  );

  return global.globalCache;
}
