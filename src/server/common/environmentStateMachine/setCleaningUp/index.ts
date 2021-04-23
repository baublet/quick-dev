import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetCleaningUpArguments {
  environment: Environment;
  trx: Transaction;
}

export { canSetCleaningUp } from "./canSetCleaningUp";
export { setCleaningUp } from "./setCleaningUp";
