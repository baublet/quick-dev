export interface EnvironmentCommand {
  id: number | string;
  adminOnly: boolean;
  environmentId: number | string;
  environmentDeleted: boolean;
  commandId: string;
  command: string;
  title: string;
  status: "waiting" | "running" | "failure" | "success";
  logs?: string;
}

export { create } from "./create";
export { getByEnvironmentId } from "./getByEnvironmentId";
export { getByCommandId } from "./getByCommandId";
export { update } from "./update";
export { createMany } from "./createMany";
export { environmentDeleted } from "./environmentDeleted";
