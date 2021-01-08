import { Environment } from "../environment";

export interface EnvironmentDomainRecord {
  id: string | number;
  environmentId: string | number;
  type: "A";
  name: string;
  data: string;
  provider: Environment["source"];
  providerId: string | number;
  deleted: boolean;
}

export { create } from "./create";
export { del } from "./delete";
export { getByEnvironmentId } from "./getByEnvironmentId";
