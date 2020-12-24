import { Connection } from "../../common/db";
import { ServiceHandler } from "../../../common/serviceHandler";

export interface ContextUser {
  avatar: string;
  name: string;
  email: string;
}

export interface Context {
  user: ContextUser | null;
  db: Connection;
  service: ServiceHandler<any>;
}

export { contextFactory } from "./contextFactory";
