import { GitHubUser, GitHubRepo } from "../gitHub";
import { cache } from "../cache";

type CacheNode<T = any> = {
  get: (key: string) => Promise<null | T>;
  set: (key: string, value: T) => Promise<void>;
};

export type Caches = {
  gitHubUserCache: CacheNode<GitHubUser>;
  gitHubUserReposCache: CacheNode<{
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nodes: GitHubRepo[];
  }>;
  gitHubRepoCache: CacheNode<GitHubRepo>;
  environmentStartupLogsCache: CacheNode<string>;
};

function makeCacheNode<K extends keyof Caches>(
  key: K,
  timeoutInSeconds?: number
): CacheNode {
  return {
    get: (nodeKey) => cache.get(`${key}-${nodeKey}`),
    set: (nodeKey, value) =>
      cache.set(`${key}-${nodeKey}`, value, timeoutInSeconds),
  };
}

export function createCache(): Caches {
  return {
    gitHubRepoCache: makeCacheNode("gitHubRepoCache", 3),
    environmentStartupLogsCache: makeCacheNode("environmentStartupLogsCache"),
    gitHubUserCache: makeCacheNode("gitHubUserCache", 60 * 30),
    gitHubUserReposCache: makeCacheNode("gitHubUserReposCache", 60),
  };
}
