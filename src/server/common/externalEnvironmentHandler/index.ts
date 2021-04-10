import { Environment, EnvironmentDomainRecord } from "../entities";
import { EnvironmentAction } from "../entities/environmentAction";
import { EnvironmentSnapshot } from "../entities/environmentSnapshot";

export interface ExternalEnvironment {
  id: string;
  name: string;
  /**
   * In gigabytes
   */
  memory: number;
  cpus: number;
  /**
   * In gigabytes
   */
  disk: number;
  locked: boolean;
  status: "new" | "active" | "off" | "archive";
  sizeSlug: string;
  provider: "digital_ocean";
  ipv4?: string;
}

export interface ExternalEnvironmentSnapshot {
  id: string;
  name: string;
  status: "available" | "pending" | "deleted";
  sizeInGb: number;
}

export interface ExternalEnvironmentAction {
  id: string;
  status: "in-progress" | "completed" | "errored";
  type: string;
}

export interface ExternalEnvironmentHandler {
  getAction: (
    environment: Environment,
    action: EnvironmentAction
  ) => Promise<ExternalEnvironmentAction>;
  getEnvironment: (environment: Environment) => Promise<ExternalEnvironment>;
  newEnvironment: (environment: Environment) => Promise<ExternalEnvironment>;
  environmentExists: (
    environment: Environment
  ) => Promise<false | ExternalEnvironment>;
  deleteSnapshot: (environmentSnapshot: EnvironmentSnapshot) => Promise<void>;
  // Should always work. If something is wrong, it throws
  destroyEnvironment: (
    environment: Pick<Environment, "sourceId" | "name">,
    environmentDomainRecords: Pick<EnvironmentDomainRecord, "providerId">[]
  ) => Promise<void>;
  removeAllTrace: (
    environment: Pick<
      Environment,
      "id" | "sourceId" | "subdomain" | "sourceSnapshotId"
    >
  ) => Promise<void>;
  // Should always work. If something is wrong, it throws
  shutdownEnvironment: (
    environment: Pick<Environment, "sourceId" | "name">,
    environmentDomainRecords: Pick<EnvironmentDomainRecord, "providerId">[]
  ) => Promise<{
    id: string;
    status: "in-progress" | "completed" | "errored";
  }>;
  createEnvironmentDomainRecord: (
    type: string,
    name: string,
    data: string
  ) => Promise<{ providerId: string }>;
  snapshotEnvironment: (
    environment: Environment
  ) => Promise<{
    id: string;
    status: "in-progress" | "completed" | "errored";
  }>;
  getSnapshot: (
    environment: Environment
  ) => Promise<ExternalEnvironmentSnapshot | undefined>;
}
