import React from "react";

import { EnvironmentLifecycleStatus } from "../generated";
import { Pill } from "../components/Pill";

const lifecycleStatusToPillStatus: Record<
  EnvironmentLifecycleStatus,
  "inert" | "danger" | "warning" | "success"
> = {
  creating: "warning",
  error_provisioning: "danger",
  finished_provisioning: "warning",
  new: "warning",
  provisioning: "warning",
  ready: "success",
  snapshotting: "warning",
  stopped: "inert",
  stopping: "warning",
};

const lifecycleStatusToPillWorkingState: Record<
  EnvironmentLifecycleStatus,
  boolean
> = {
  creating: true,
  error_provisioning: false,
  finished_provisioning: false,
  new: true,
  provisioning: true,
  ready: false,
  snapshotting: true,
  stopped: false,
  stopping: true,
};

export function EnvironmentStatusBadge({
  status,
}: {
  status: EnvironmentLifecycleStatus;
}) {
  return (
    <Pill
      variant={lifecycleStatusToPillStatus[status]}
      working={lifecycleStatusToPillWorkingState[status]}
    >
      {status}
    </Pill>
  );
}
