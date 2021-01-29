export interface EnvironmentCommand {
  adminOnly: boolean;
  command: string;
  created_at: Date;
  environmentId: string;
  id: string;
  logs?: string;
  status: "waiting" | "running" | "failed" | "success" | "cancelled";
  title: string;
  updated_at: Date;
  order: number;
}

export { create } from "./create";
export { getByEnvironmentId } from "./getByEnvironmentId";
export { getById } from "./getById";
export { update } from "./update";
export { createMany } from "./createMany";
export { loader } from "./loader";
