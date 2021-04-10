import { EnvironmentSource } from "../environment";

export interface EnvironmentSnapshot {
  id: string;
  updated_at: Date;
  created_at: Date;
  environmentId: string;
  source: EnvironmentSource;
  sourceId: string;
  deleted: boolean;
  deletedInProvider: boolean;
  sizeInGb: number;
}

export { create } from "./create";
export { getByIdOrFail } from "./getByIdOrFail";
export { update } from "./update";
export { deleteByEnvironmentId } from "./deleteByEnvironmentId";
export { getByEnvironmentId } from "./getByEnvironmentId";
