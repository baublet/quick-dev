import { Environment, EnvironmentDomainRecord } from "../entities";

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

export interface ExternalEnvironmentHandler {
  getEnvironment: (environment: Environment) => Promise<ExternalEnvironment>;
  newEnvironment: (environment: Environment) => Promise<ExternalEnvironment>;
  environmentExists: (
    environment: Environment
  ) => Promise<false | ExternalEnvironment>;
  // Should always work. If something is wrong, it throws
  destroyEnvironment: (
    environment: Pick<Environment, "sourceId">,
    environmentDomainRecords: Pick<EnvironmentDomainRecord, "providerId">[]
  ) => Promise<void>;
  createEnvironmentDomainRecord: (
    type: string,
    name: string,
    data: string
  ) => Promise<{ providerId: string }>;
}
