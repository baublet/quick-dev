import { EnvironmentUserSource } from "../environment";

export interface SSHKey {
  id: number | string;
  environmentId: number;
  userSource: EnvironmentUserSource;
  user: string;
  privateKey: string;
  publicKey: string;
  fingerprint: string;
}

export { create } from "./create";
export { getByUser } from "./getByUser";
export { getById } from "./getById"