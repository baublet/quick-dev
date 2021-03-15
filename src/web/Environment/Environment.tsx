import React from "react";
import cx from "classnames";

import type { EnvironmentSize } from "../../lambda/common/entities/environment";

import { useEnvironmentDetails } from "./useEnvironmentDetails";
import { EnvironmentLogs } from "./EnvironmentLogs";

import { H3 } from "../components/H3";
import { RightNavigationLayout } from "../components/RightNavigationLayout";
import { LoaderInline } from "../components/LoaderInline";
import { EnvironmentActions } from "./EnvironmentActions";
import { EnvironmentBuilding } from "./EnvironmentBuilding";
import { MachineSize } from "../components/MachineSize";
import { Link } from "../components/Link";

interface EnvironmentProps {
  id: string;
}

export function Environment({ id }: EnvironmentProps) {
  const { loading, environment } = useEnvironmentDetails(id);

  if (loading || !environment) {
    return null;
  }

  const hasLogs = Boolean(environment && environment.logs);

  return (
    <div>
      <RightNavigationLayout
        navigation={<EnvironmentActions environment={environment} />}
        content={
          <>
            <div className="mb-4 flex">
              <div
                className={cx(
                  "rounded-full p-2 inline-block w-16 mr-6 text-white",
                  {
                    "bg-green-500": environment.lifecycleStatus === "ready",
                    "bg-yellow-500 animate-pulse":
                      environment.lifecycleStatus === "finished_provisioning",
                  }
                )}
              >
                <MachineSize size={environment.size as EnvironmentSize} />
              </div>
              <div className="flex flex-col">
                <H3>{environment?.name || ""}</H3>
                <span>
                  <Link to={environment.repositoryHttpUrl} external={true}>
                    {environment.repositoryUrl}
                  </Link>
                </span>
              </div>
            </div>
            <b>Status:</b> {environment.lifecycleStatus}
          </>
        }
      />
      {!hasLogs ? (
        <EnvironmentBuilding />
      ) : (
        <div className="mt-4">
          <EnvironmentLogs
            environmentId={environment?.id}
            startupLogs={environment?.logs?.startupLogs || ""}
            commands={environment?.logs?.commands || []}
          />
        </div>
      )}
    </div>
  );
}
