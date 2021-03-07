import { EnvironmentSource } from "../environment";

export interface EnvironmentSnapshot {
  id: string;
  updated_at: Date;
  created_at: Date;
  environmentId: string;
  source: string;
  sourceId: EnvironmentSource;
  deleted: boolean;
  deletedInProvider: boolean;
  sizeInGb: number;
}

export { create } from "./create";
export { getByIdOrFail } from "./getByIdOrFail";
export { update } from "./update";
