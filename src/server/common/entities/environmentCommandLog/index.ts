export interface EnvironmentCommandLog {
  id: string;
  created_at: Date;
  updated_at: Date;
  environmentId: string;
  environmentCommandId: string;
  logOutput: string;
}

export { create } from "./create";
export { getByEnvironmentCommandId } from "./getByEnvironmentCommandId";
