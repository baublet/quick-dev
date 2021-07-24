import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetErrorCreatingArguments {
  environment: Environment;
  trx: Transaction;
}

export { canSetErrorCreating } from "./canSetErrorCreating";
export { setErrorCreating } from "./setErrorCreating";
