import fetch from "node-fetch";

import { githubApi } from "../../common/githubApi";
import { createCache } from "../../../common/simpleCache";

declare global {
  module NodeJS {
    interface Global {
      gitHubUserCache: ReturnType<typeof createCache>;
    }
  }
}

global.gitHubUserCache =
  global.gitHubUserCache || createCache({}, 1000 * 60 * 5);
const gitHubUserCache = global.gitHubUserCache;

interface GitHubUserResponse {
  id: number;
  avatar_url: string;
  html_url: string;
  repos_url: string;
  name: string;
  email: string;
  public_repos: number;
}

interface GitHubUser {
  id: string;
  avatar: string;
  bioUrl: string;
  reposUrl: string;
  name: string;
  email: string;
  publicRepos: number;
}

export async function loadGitHubUser({
  scope,
  accessToken,
}: {
  scope: string;
  tokenType: string;
  accessToken: string;
}): Promise<GitHubUser | null> {
  if (!accessToken) {
    return null;
  }

  if (!gitHubUserCache.has(accessToken)) {
    const fetchResponse = (await githubApi({
      path: `user?scope=${scope}`,
      accessToken,
    })) as GitHubUserResponse;

    const userData: GitHubUser = {
      id: fetchResponse.id.toString(),
      avatar: fetchResponse.avatar_url,
      bioUrl: fetchResponse.html_url,
      reposUrl: fetchResponse.repos_url,
      name: fetchResponse.name,
      email: fetchResponse.email,
      publicRepos: fetchResponse.public_repos,
    };

    gitHubUserCache.set(accessToken, userData);
  }

  return gitHubUserCache.get<GitHubUser>(accessToken);
}
