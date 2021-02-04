export type EnvironmentLifecycleStatus =
  | "new"
  | "creating"
  | "provisioning"
  | "error_provisioning"
  | "finished_provisioning"
  | "starting";

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
  sshKeyId: string;
  startupLogs?: string | null;
  strapYardFile: string;
  subdomain: string;
  updated_at: Date;
  user: string;
  userSource: EnvironmentUserSource;
}

export { create } from "./create";
export { get } from "./get";
export { update } from "./update";
export { getEnvironmentCommandThatNeedsWork } from "./getEnvironmentCommandThatNeedsWork";
export { getEnvironmentCount } from "./getEnvironmentCount";
export { resetProcessorByEnvironmentId } from "./resetProcessorByEnvironmentId";
export { loader } from "./loader";
export { getById } from "./getById";
export { getBySubdomain } from "./getBySubdomain";
export { getBySecret } from "./getBySecret";
export { del } from "./delete";
export { touch } from "./touch";
