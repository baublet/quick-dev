import React from "react";

import { useEnvironmentDetailsQuery } from "../generated";
import type { EnvironmentLifecycleStatus as EnvironmentLifecycleStatusEnum } from "../../server/common/entities";

export type EnvironmentLifecycleStatus = EnvironmentLifecycleStatusEnum;

export function useEnvironmentDetails(id: string) {
  const { loading, data } = useEnvironmentDetailsQuery({
    variables: {
      id,
    },
    pollInterval: 5000,
  });

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
