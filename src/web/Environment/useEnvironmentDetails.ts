import { useQuery, gql } from "@apollo/client";

import type { Environment } from "../../lambda/common/environment";

const ENVIRONMENTS_QUERY = gql`
  query($id: String!) {
    environment(input: { id: $id }) {
      id
      name
      subdomain
      ipv4
      logs {
        startupLogs
      }
    }
  }
`;

interface EnvironmentDetailsReturn {
  loading: boolean;
  environment:
    | null
    | (Pick<
        Environment,
        "id" | "name" | "subdomain" | "ipv4" | "repositoryUrl"
      > & {
        logs: null | {
          startupLogs: string;
        };
      });
}

export function useEnvironmentDetails(
  id: number | string
): EnvironmentDetailsReturn {
  const { loading, data } = useQuery<{
    environment: EnvironmentDetailsReturn["environment"];
  }>(ENVIRONMENTS_QUERY, {
    variables: { id },
  });

  if (loading) {
    return {
      loading: true,
      environment: null,
    };
  }

  return {
    loading: false,
    environment: data.environment,
  };
}
