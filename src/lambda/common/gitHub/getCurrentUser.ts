import { githubApi } from "./githubApi";
import { Context } from "../context";

interface GitHubUserResponse {
  id: number;
  avatar_url: string;
  html_url: string;
  repos_url: string;
  name: string;
  email: string;
  public_repos: number;
}

export interface GitHubUser {
  id: string;
  avatar: string;
  bioUrl: string;
  reposUrl: string;
  name: string;
  email: string;
  publicRepos: number;
}

export async function getCurrentUser(
  context: Context
): Promise<GitHubUser | null> {
  const accessToken = context.accessToken;
  if (!accessToken) {
    return null;
  }

  const gitHubUserCache = context.cache.gitHubUserCache;

  if (!gitHubUserCache.has(accessToken)) {
    const fetchResponse = (await githubApi({
      path: "user?scope=user",
      accessToken,
    })) as GitHubUserResponse;

    console.log("GitHub user fetch res: ", fetchResponse)

    if(!fetchResponse.id) {
      return null;
    }

    const userData: GitHubUser = {
      id: fetchResponse.id?.toString(),
      avatar: fetchResponse.avatar_url,
      bioUrl: fetchResponse.html_url,
      reposUrl: fetchResponse.repos_url,
      name: fetchResponse.name,
      email: fetchResponse.email,
      publicRepos: fetchResponse.public_repos,
    };

    gitHubUserCache.set(accessToken, userData);
  } else {
    console.debug("Cache hit for gitHub/getCurrentUser")
  }

  return gitHubUserCache.get(accessToken);
}
