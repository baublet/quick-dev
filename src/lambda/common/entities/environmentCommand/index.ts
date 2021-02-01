export type EnvironmentCommandStatus =
  | "waiting"
  | "ready"
  | "sending"
  | "running"
  | "failed"
  | "success"
  | "cancelled";

export interface EnvironmentCommand {
  adminOnly: boolean;
  command: string;
  processor?: string | null;
  created_at: Date;
  environmentId: string;
  id: string;
  logs?: string;
  status: EnvironmentCommandStatus;
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
export { getEnvironmentCommandThatNeedsWork } from "./getEnvironmentCommandThatNeedsWork";
export { resetProcessorByEnvironmentCommandId } from "./resetProcessorByEnvironmentId";
