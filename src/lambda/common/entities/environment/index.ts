export type EnvironmentLifecycleStatus =
  | "new"
  | "creating"
  | "provisioning"
  | "error_provisioning"
  | "finished_provisioning"
  | "starting"
  | "starting_from_snapshot"
  | "ready"
  | "stopping"
  | "snapshotting"
  | "stopped";

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
  sourceSnapshotId?: string;
  sshKeyId: string;
  startupLogs?: string | null;
  strapYardFile: string;
  subdomain: string;
  updated_at: Date;
  user: string;
  userSource: EnvironmentUserSource;
  working: boolean;
}

export { create } from "./create";
export { get } from "./get";
export { update } from "./update";
export { getEnvironmentsThatNeedWork } from "./getEnvironmentsThatNeedWork";
export { getEnvironmentCount } from "./getEnvironmentCount";
export { loader } from "./loader";
export { getById } from "./getById";
export { getBySubdomain } from "./getBySubdomain";
export { getBySecret } from "./getBySecret";
export { del } from "./delete";
export { touch } from "./touch";
export { getProvisioningEnvironment } from "./getProvisioningEnvironment";
export { setNotWorking } from "./setNotWorking";
export { setWorking } from "./setWorking";
export { getByIdOrFail } from "./getByIdOrFail";
export { getEnvironmentsWhoseUrlsNeedUpdating } from "./getEnvironmentsWhoseUrlsNeedUpdating";
export { rescueEnvironments } from "./rescueEnvironments";
