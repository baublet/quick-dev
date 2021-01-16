import React from "react";

import { useEnvironmentDetailsQuery } from "../generated";
import type { EnvironmentLifecycleStatus } from "../../lambda/common/entities";

function shouldPoll(status: undefined | EnvironmentLifecycleStatus): boolean {
  if (!status) return true;
  if (status === "provisioning") return true;
  if (status === "creating") return true;
  if (status === "new") return true;
  return false;
}

export function useEnvironmentDetails(id: string) {
  const { loading, data, refetch } = useEnvironmentDetailsQuery({
    variables: {
      id,
    },
  });

  console.log({ data });

  React.useEffect(() => {
    const lifecycleStatus: undefined | EnvironmentLifecycleStatus = data
      ?.environment?.lifecycleStatus as EnvironmentLifecycleStatus;
    if (shouldPoll(lifecycleStatus)) {
      const interval = setInterval(() => {
        console.log("REFETCH");
        refetch({ id });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data?.environment?.lifecycleStatus]);

  if (loading || !data) {
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
