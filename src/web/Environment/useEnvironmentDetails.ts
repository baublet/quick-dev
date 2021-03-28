import React from "react";

import { useEnvironmentDetailsQuery } from "../generated";
import type { EnvironmentLifecycleStatus as EnvironmentLifecycleStatusEnum } from "../../lambda/common/entities";

export type EnvironmentLifecycleStatus = EnvironmentLifecycleStatusEnum;

function shouldPoll(status: undefined | EnvironmentLifecycleStatus): boolean {
  if (!status) return true;
  if (status === "provisioning") return true;
  if (status === "creating") return true;
  if (status === "new") return true;
  return false;
}

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
