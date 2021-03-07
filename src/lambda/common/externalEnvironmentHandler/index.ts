import { Environment, EnvironmentDomainRecord } from "../entities";
import { EnvironmentAction } from "../entities/environmentAction";

interface ExternalEnvironment {
  id: string;
  name: string;
  memory: number; // in GB
  cpus: number;
  disk: number; // in GB
  locked: boolean;
  status: "new" | "active" | "off" | "archive";
  sizeSlug: string;
  provider: "digital_ocean";
  ipv4?: string;
}

interface ExternalEnvironmentAction {
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
  // Should always work. If something is wrong, it throws
  destroyEnvironment: (
    environment: Pick<Environment, "sourceId" | "name">,
    environmentDomainRecords: Pick<EnvironmentDomainRecord, "providerId">[]
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
}
