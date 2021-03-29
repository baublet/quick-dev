import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetReadyArguments {
  trx: Transaction;
  environment: Environment;
}

export { canSetReady } from "./canSetReady";
export { setReady } from "./setReady";
