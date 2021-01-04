import { useCurrentUserEnvironmentsQuery } from "../generated";

export function useCurrentUserEnvironments() {
  const { loading, data } = useCurrentUserEnvironmentsQuery({
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
