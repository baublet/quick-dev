export interface EnvironmentCommand {
  adminOnly: boolean;
  command: string;
  commandId: string;
  created_at: Date;
  environmentId: string;
  id: string;
  logs?: string;
  status: "waiting" | "running" | "failure" | "success";
  title: string;
  updated_at: Date;
}

export { create } from "./create";
export { getByEnvironmentId } from "./getByEnvironmentId";
export { getByCommandId } from "./getByCommandId";
export { update } from "./update";
export { createMany } from "./createMany";
