import fetch from "node-fetch";

import { createCache } from "../../../common/simpleCache";

const gitHubUserCache = createCache({}, 1000 * 60 * 5);

interface GitHubUserResponse {
  avatar_url: string;
  html_url: string;
  repos_url: string;
  name: string;
  email: string;
  public_repos: number;
}

interface GitHubUser {
  avatar: string;
  bioUrl: string;
  reposUrl: string;
  name: string;
  email: string;
  publicRepos: number;
}

export async function loadGitHubUser({
  scope,
  tokenType,
  accessToken,
}: {
  scope: string;
  tokenType: string;
  accessToken: string;
}): Promise<GitHubUser> {
  if (!gitHubUserCache.has(accessToken)) {
    const fetchResponse: GitHubUserResponse = await fetch(
      `https://api.github.com/user?scope=${scope}`,
      {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      }
    ).then((response) => response.json());

    const userData: GitHubUser = {
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
