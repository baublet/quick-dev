import { Context } from "../context";
import { githubApi } from "./githubApi";

interface GitHubRepoResponse {
  id: number;
  full_name: string;
  private: boolean;
  url: string;
  git_url: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  private: boolean;
  htmlUrl: string;
  gitUrl: string;
}

export async function getRepositoryByUrl(
  context: Context,
  {
    repositoryUrl,
  }: {
    repositoryUrl: string;
  }
): Promise<GitHubRepo> {
  if (!context.accessToken) {
    throw new Error("Not authorized");
  }

  const urlParts = repositoryUrl.split("/");
  const owner = urlParts[urlParts.length - 2];
  const repoWithDotGit = urlParts[urlParts.length - 1];
  const repo = repoWithDotGit.endsWith(".git")
    ? repoWithDotGit.substr(0, repoWithDotGit.length - 4)
    : repoWithDotGit;
  const fetchResponse = await githubApi<GitHubRepoResponse>({
    path: `repos/${owner}/${repo}`,
    accessToken: context.accessToken,
    expectStatus: 200,
  });

  const fetchedRepo = {
    id: `${fetchResponse.id}`,
    name: fetchResponse.full_name,
    private: fetchResponse.private,
    htmlUrl: fetchResponse.url,
    gitUrl: fetchResponse.git_url,
  };

  return fetchedRepo;
}
