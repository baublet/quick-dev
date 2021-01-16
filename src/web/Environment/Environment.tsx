import React from "react";

import { useEnvironmentDetails } from "./useEnvironmentDetails";
import { EnvironmentLogs } from "./EnvironmentLogs";

import { H3 } from "../components/H3";
import { RightNavigationLayout } from "../components/RightNavigationLayout";
import { Loader } from "../components/Loader";
import { EnvironmentActions } from "./EnvironmentActions";
import { EnvironmentBuilding } from "./EnvironmentBuilding";

interface EnvironmentProps {
  id: string;
}

export function Environment({ id }: EnvironmentProps) {
  const { loading, environment } = useEnvironmentDetails(id);
  const hasLogs = Boolean(environment && environment.logs);

  console.log("DEETS: ", environment);

  return (
    <div>
      <RightNavigationLayout
        navigation={
          loading ? null : <EnvironmentActions environment={environment} />
        }
        content={
          <>
            <H3>{environment?.name || ""}</H3>
            <Loader display={loading} />
          </>
        }
      />
      {loading ? null : !hasLogs ? (
        <EnvironmentBuilding />
      ) : (
        <EnvironmentLogs
          environmentId={environment.id}
          startupLogs={environment.logs.startupLogs}
          commands={environment.logs.commands}
        />
      )}
    </div>
  );
}
