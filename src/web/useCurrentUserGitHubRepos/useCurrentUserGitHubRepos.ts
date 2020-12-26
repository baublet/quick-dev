import { useQuery, gql } from "@apollo/client";

import type { GitHubRepo } from "../../lambda/common/gitHub/getCurrentUserRepos";

const GITHUB_REPOS_QUERY = gql`
  query($page: Int!) {
    user {
      repositories {
        gitHub(input: { page: $page, perPage: 25 }) {
          totalPages
          currentPage
          hasNextPage
          hasPreviousPage
          nodes {
            id
            name
            gitUrl
            htmlUrl
          }
        }
      }
    }
  }
`;

export function useCurrentUserGitHubRepos(
  page: number = 1
): {
  loading: boolean;
  repositories: GitHubRepo[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const { loading, data } = useQuery<{
    user: {
      repositories: {
        gitHub: {
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          nodes: GitHubRepo[];
        };
      };
    };
  }>(GITHUB_REPOS_QUERY, {
    variables: {
      page,
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

  console.log({ data });

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
