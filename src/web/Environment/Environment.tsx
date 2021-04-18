import React from "react";
import cx from "classnames";
import copy from "copy-to-clipboard";

import type { EnvironmentSize } from "../../server/common/entities/environment";

import {
  useEnvironmentDetails,
  EnvironmentLifecycleStatus,
} from "./useEnvironmentDetails";
import { EnvironmentLogs } from "./EnvironmentLogs";

import { H3 } from "../components/H3";
import { RightNavigationLayout } from "../components/RightNavigationLayout";
import { EnvironmentActions } from "./EnvironmentActions";
import { EnvironmentBuilding } from "./EnvironmentBuilding";
import { MachineSize } from "../components/MachineSize";
import { Link } from "../components/Link";
import { Loader } from "../components/Loader";
import { Divider } from "../components/Divider";
import { EnvironmentStatusBadge } from "./EnvironmentStatusBadge";
import { CopyToClipboard } from "../components/buttons/CopyToClipboard";

interface EnvironmentProps {
  id: string;
}

const StatusMap: Record<
  EnvironmentLifecycleStatus,
  "red" | "green" | "yellow" | "gray"
> = {
  creating: "yellow",
  error_provisioning: "red",
  finished_provisioning: "yellow",
  new: "yellow",
  provisioning: "yellow",
  ready: "green",
  snapshotting: "yellow",
  starting: "yellow",
  starting_from_snapshot: "yellow",
  stopped: "gray",
  stopping: "yellow",
};

const StatusClassNames: Record<"red" | "green" | "yellow" | "gray", string> = {
  gray: "bg-gray-300",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500 animate-pulse",
};

export function Environment({ id }: EnvironmentProps) {
  const { loading, environment } = useEnvironmentDetails(id);

  if (loading || !environment) {
    return <Loader />;
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
                  "rounded-full p-2 inline-block w-16 mr-6 text-white h-16",
                  StatusClassNames[StatusMap[environment.lifecycleStatus]]
                )}
              >
                <MachineSize size={environment.size as EnvironmentSize} />
              </div>
              <div className="flex flex-col">
                <H3 className="mt-2">{environment?.name || ""}</H3>
                <div className="my-2">
                  <EnvironmentStatusBadge
                    status={environment.lifecycleStatus}
                  />
                </div>
                <div>
                  <Link to={environment.repositoryHttpUrl} external={true}>
                    {environment.repositoryUrl}
                  </Link>
                </div>
                <div>
                  <b>image:</b> {environment.image}
                </div>
              </div>
            </div>
          </>
        }
      />
      <Divider />
      <div className="my-2 flex justify-between">
        <div>
          <b>URL:</b>
          <br />
          {environment.lifecycleStatus === "ready" ? (
            <Link to={environment.url} external>
              {environment.url}
            </Link>
          ) : (
            environment.url
          )}
        </div>
        {environment.secret ? (
          <div className="flex items-center ml-4">
            <div className="mr-2">
              <b>password:</b>
              <br /> {environment.secret.substr(0, 6) + "**********"}
            </div>
            <CopyToClipboard textToCopy={environment.secret} />
          </div>
        ) : null}
        {environment.ipv4 ? (
          <div className="flex items-center ml-4">
            <div className="mr-2">
              <b>ipv4:</b>
              <br /> {environment.ipv4}
            </div>
            <CopyToClipboard textToCopy={environment.ipv4} />
          </div>
        ) : null}
      </div>
      <Divider />
      {!hasLogs ? (
        <EnvironmentBuilding />
      ) : (
        <div className="mt-4">
          <EnvironmentLogs
            environmentId={environment?.id}
            commands={environment?.logs?.commands || []}
          />
        </div>
      )}
    </div>
  );
}
