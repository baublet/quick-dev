import React from "react";

import type { Environment } from "../../lambda/common/environment";
import { H3 } from "../components/H3";
import { Loader } from "../components/Loader";
import { useEnvironmentDetails } from "./useEnvironmentDetails";
import { EnvironmentLogs } from "./EnvironmentLogs";

interface EnvironmentProps {
  id: number | string;
}

export function Environment({ id }: EnvironmentProps) {
  const { loading, environment } = useEnvironmentDetails(id);

  return (
    <div>
      <Loader display={loading} />
      {!environment ? null : (
        <>
          <H3>{environment.name}</H3>
          <EnvironmentLogs
            environmentId={environment.id}
            startupLogs={environment.logs.startupLogs}
          />
        </>
      )}
    </div>
  );
}
