export interface User {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export { create } from "./create";
export { getById } from "./getById";
export { getByIdOrFail } from "./getByIdOrFail";
export { update } from "./update";
