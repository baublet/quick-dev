import { Environment } from "../environment";

export interface EnvironmentDomainRecord {
  id: string;
  environmentId: string;
  type: "A";
  name: string;
  data: string;
  provider: Environment["source"];
  providerId: string;
  deleted: boolean;
}

export { create } from "./create";
export { del } from "./delete";
export { getByEnvironmentId } from "./getByEnvironmentId";
