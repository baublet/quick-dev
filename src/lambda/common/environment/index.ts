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

export type EnvironmentUserSource = "github";

export type EnvironmentSource = "digital_ocean";

export type EnvironmentSize = "s" | "m" | "l" | "xl" | "xxl";

export interface Environment {
  created_at: Date;
  deleted: boolean;
  id: string;
  ipv4: string;
  lifecycleStatus: EnvironmentLifecycleStatus;
  name: string;
  processor?: string;
  repositoryUrl: string;
  secret: string;
  size: EnvironmentSize;
  source: EnvironmentSource;
  sourceId?: string;
  sshKeyId: number;
  startupLogs?: string;
  strapYardFile: string;
  subdomain: string;
  updated_at: Date;
  user: string;
  userSource: EnvironmentUserSource;
}

export { create } from "./create";
export { get } from "./get";
export { update } from "./update";
export { getEnvironmentThatNeedsWork } from "./getEnvironmentThatNeedsWork";
export { getEnvironmentCount } from "./getEnvironmentCount";
export { resetProcessorByEnvironmentId } from "./resetProcessorByEnvironmentId";
export { loader } from "./loader";
export { getById } from "./getById";
export { getBySubdomain } from "./getBySubdomain";
export { getBySecret } from "./getBySecret";
export { del } from "./delete";
