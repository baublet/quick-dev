import { Environment } from "../../common/environment";
import { EnvironmentDomainRecord } from "../../common/environmentDomainRecord";

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

export interface EnvironmentHandler {
  getEnvironment: (environment: Environment) => Promise<ExternalEnvironment>;
  newEnvironment: (environment: Environment) => Promise<ExternalEnvironment>;
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
