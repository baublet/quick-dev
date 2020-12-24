import { Transaction } from "../../common/db";

export interface ContextUser {
  avatar: string;
  name: string;
  email: string;
}

export interface Context {
  user: ContextUser | null;
  transaction: Transaction;
}

export { contextFactory } from "./contextFactory";
