import { useCurrentUserGitHubReposQuery } from "../generated";

export function useCurrentUserGitHubRepos(
  page: number = 1,
  perPage: number = 10
) {
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
    };
  }

  const gitHubData = data?.user?.repositories?.gitHub || ({} as any);
  const nodes = gitHubData.nodes || [];
  const hasNextPage = Boolean(gitHubData.hasNextPage);
  const hasPreviousPage = Boolean(gitHubData.hasPreviousPage);

  return {
    loading: false,
    hasPreviousPage,
    hasNextPage,
    repositories: nodes,
  };
}
