import { EnvironmentUserSource } from "../environment";

export interface SSHKey {
  id: number;
  environmentId: number;
  userSource: EnvironmentUserSource;
  user: string;
  privateKey: string;
  publicKey: string;
}

export { create } from "./create";
export { getByUser } from "./getByUser";
