import { EnvironmentUserSource } from "../environment";

export interface SSHKey {
  id: string;
  environmentId: string;
  userSource: EnvironmentUserSource;
  user: string;
  privateKey: string;
  publicKey: string;
  fingerprint: string;
}

export { create } from "./create";
export { getByUser } from "./getByUser";
export { getById } from "./getById";
export { getByUserOrFail } from "./getByUserOrFail";
