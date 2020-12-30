export interface EnvironmentLog {
  id: number;
  environmentId: number;
  log: string;
}

export { create } from "./create";
export { getByEnvironmentId } from "./getByEnvironmentId";
