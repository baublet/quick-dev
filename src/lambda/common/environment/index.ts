export type EnvironmentLifecycleStatus =
  | "new"
  | "creating"
  | "provisioning"
  | "error_provisioning"
  | "paused" // You can always pause (e.g., in DO, "shut down")
  | "pausing"
  | "stopped" // You can always stop (e.g., in DO, "shut down", snapshot, delete)
  | "stopping"
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

export type EnvironmentSource = "digital_ocean";

export type EnvironmentSize = "s" | "m" | "l" | "xl" | "xxl";

export interface Environment {
  created_at: Date;
  deleted: boolean;
  id: number;
  ipv4: string;
  lifecycleStatus: EnvironmentLifecycleStatus;
  name: string;
  repositoryUrl: string;
  size: EnvironmentSize;
  source: EnvironmentSource;
  sourceId?: string;
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
export { resetEnvironmentId } from "./resetEnvironmentId";
