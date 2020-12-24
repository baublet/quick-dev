interface Environment {
  id: number;
  publicId: string;
  provider: "digital_ocean";
  status:
    | "hibernating"
    | "shutdown"
    | "saving_snapshot"
    | "powering_on"
    | "provisioning"
    | "shutting_down"
    | "ready";
  publicStatus: "on" | "off";
  repositoryUrl: string;
  ipv4?: string;
  port?: number;
}

interface FindEnvironmentParameters {
  id?: number;
  publicId?: string;
}

export interface EnvironmentHandler {
  findEnvironment: (
    search: FindEnvironmentParameters
  ) => Promise<Environment | undefined>;
  createEnvironment: () => Promise<void>;
  shutdownEnvironment: () => Promise<void>;
  snapshotEnvironment: () => Promise<void>;
}
