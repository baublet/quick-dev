import { useQuery, gql } from "@apollo/client";

import type { Environment } from "../../lambda/common/environment";

const ENVIRONMENTS_QUERY = gql`
  {
    user {
      environments {
        totalCount
        nodes {
          id
          name
          size
          lifecycleStatus
        }
      }
    }
  }
`;

interface Environments {
  user: {
    environments: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nodes: Pick<Environment, "id" | "name" | "size" | "lifecycleStatus">[];
    };
  };
}

export function useCurrentUserEnvironments() {
  const { loading, data } = useQuery<Environments>(ENVIRONMENTS_QUERY, {
    pollInterval: 5000,
  });

  if (loading) {
    return {
      loading: true,
      environments: [],
    };
  }

  return {
    loading: false,
    environments: data?.user?.environments?.nodes || [],
  };
}
