import { useEnvironmentDetailsQuery } from "../generated";

export function useEnvironmentDetails(id: string) {
  const { loading, data } = useEnvironmentDetailsQuery({
    variables: {
      id,
    },
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

export type EnvironmentDetails = ReturnType<typeof useEnvironmentDetails>;
