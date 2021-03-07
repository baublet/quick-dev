/**
 * Actions in downstream providers. Each shape is different, but it's nothing we
 * ever need to query against. So we store the payload as a JSON string that we
 * parse and update as needed. We do this because provider "action" shapes are
 * different.
 *
 * an environment can only run a single action at a time. There is a unique
 * constraint for `environmentId` to enforce this. Once the action is complete,
 * delete the row in this database.
 */
export interface EnvironmentAction {
  id: string;
  environmentId: string;
  actionPayload: string;
}

export { create } from "./create";
export { deleteByEnvironmentId } from "./deleteByEnvironmentId";
export { getByEnvironmentId } from "./getByEnvironmentId";
export { update } from "./update";
