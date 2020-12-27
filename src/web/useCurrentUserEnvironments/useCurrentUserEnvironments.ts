import type { Environment } from "../../lambda/common/environment";
import { useQuery, gql } from "@apollo/client";

const ENVIRONMENTS_QUERY = gql`
  {
    user {
      environments {
        totalCount
        nodes {
          id
          name
          size
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
      nodes: Pick<Environment, "id" | "name" | "size">[];
    };
  };
}

export function useCurrentUserEnvironments() {
  const { loading, data } = useQuery<Environments>(ENVIRONMENTS_QUERY);

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
