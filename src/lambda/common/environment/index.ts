import {} from "../context";

export type EnvironmentLifecycleStatus =
  | "new"
  | "creating"
  | "error_creating"
  | "provisioning"
  | "error_provisioning"
  | "paused" // You can always pause (e.g., in DO, "shut down")
  | "stopped" // You can always stop (e.g., in DO, "shut down", snapshot, delete)
  | "saving_snapshot"
  | "starting"
  | "error_starting"
  | "resizing"
  | "error_resizing"
  | "up";

export type EnvironmentSubdomainStatus =
  | "not_configured"
  | "configured"
  | "error_configuring";

export type EnvironmentUserSource = "github";

export type EnvironmentSource = "do";

export type EnvironmentSize = "s" | "m" | "l" | "xl";

export interface Environment {
  created_at: Date;
  deleted: boolean;
  id: number;
  ipv4: string;
  lifeCycleStatus: EnvironmentLifecycleStatus;
  name: string;
  repositoryUrl: string;
  size: EnvironmentSize;
  source: EnvironmentSource;
  subdomain: string;
  subdomainStatus: EnvironmentSubdomainStatus;
  updated_at: Date;
  user: string;
  userSource: EnvironmentUserSource;
  processor?: string;
}

export { create } from "./create";
export { get } from "./get";
export { update } from "./update";
export { getEnvironmentThatNeedsWork } from "./getEnvironmentThatNeedsWork";
export { getEnvironmentCount } from "./getEnvironmentCount";
