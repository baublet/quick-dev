import { Connection } from "../../common/db";
import { ServiceHandler } from "./serviceHandler";

export interface ContextUser {
  id: string;
  avatar: string;
  name: string;
  email: string;
}

export interface Context {
  user: ContextUser | null;
  db: Connection;
  service: ServiceHandler<any>;
  authorizationToken?: string;
}

export { contextFactory } from "./contextFactory";
