import { githubApi } from "../../../common/githubApi";
import { Context } from "../../contextFactory";

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
    page = 1,
    perPage = 25,
  }: {
    perPage: number;
    page: number;
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

  const fetchResponse = await githubApi<GitHubRepoResponse[]>({
    path: `user/repos?per_page=${perPage}&page=${page}`,
    accessToken: context.authorizationToken,
  });

  return {
    currentPage: page,
    nodes: fetchResponse.map((repo) => ({
      id: `${repo.id}`,
      name: repo.full_name,
      private: repo.private,
      htmlUrl: repo.url,
      gitUrl: repo.git_url,
    })),
  };
}
