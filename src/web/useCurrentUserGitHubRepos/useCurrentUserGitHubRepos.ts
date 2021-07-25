import { useCurrentUserGitHubReposQuery } from "../generated";

export function useCurrentUserGitHubRepos(
  page: number = 1,
  perPage: number = 10
): {
  loading: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  repositories: {
    id: string;
    name: string;
    gitUrl: string;
    htmlUrl: string;
  }[];
  popular: {
    id: string;
    name: string;
    gitUrl: string;
    htmlUrl: string;
  }[];
} {
  const { loading, data } = useCurrentUserGitHubReposQuery({
    variables: {
      page,
      perPage,
    },
  });

  if (loading) {
    return {
      loading: true,
      repositories: [],
      hasPreviousPage: false,
      hasNextPage: false,
      popular: [],
    };
  }

  const gitHubData = data?.user?.repositories?.gitHub;
  const nodes = gitHubData?.nodes || [];
  const hasNextPage = Boolean(gitHubData?.hasNextPage);
  const hasPreviousPage = Boolean(gitHubData?.hasPreviousPage);

  return {
    loading: false,
    hasPreviousPage,
    hasNextPage,
    repositories: nodes,
    popular: data?.user?.repositories.popularGitHubRepos.nodes || [],
  };
}
