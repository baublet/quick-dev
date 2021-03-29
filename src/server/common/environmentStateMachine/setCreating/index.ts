import { Environment } from "../../entities";
import { Transaction } from "../../db";

export interface SetCreatingArguments {
  trx: Transaction;
  environment: Environment;
}

export { canSetCreating } from "./canSetCreating";
export { setCreating } from "./setCreating";
