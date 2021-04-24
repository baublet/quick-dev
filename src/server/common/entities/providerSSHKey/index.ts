import { EnvironmentSource } from "../environment";

export interface ProviderSSHKey {
  id: string;
  sshKeyId: string;
  userId: string;
  source: EnvironmentSource;
  sourceId: string;
}

export { create } from "./create";
export { get } from "./get";
export { getBySSHKeyId } from "./getBySSHKeyId";
export { update } from "./update";
