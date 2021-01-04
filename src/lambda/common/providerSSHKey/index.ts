import { EnvironmentUserSource, EnvironmentSource } from "../environment";

export interface ProviderSSHKey {
  id: number | string;
  sshKeyId: number;
  userSource: EnvironmentUserSource;
  user: string;
  source: EnvironmentSource;
  sourceId: string;
}

export { create } from "./create";
export { get } from "./get";
export { getBySSHKeyId } from "./getBySSHKeyId";
