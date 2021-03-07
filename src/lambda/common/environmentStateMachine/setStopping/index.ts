import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetReadyArguments {
  trx: Transaction;
  environment: Environment;
}

export { canSetStopping } from "./canSetStopping";
export { setStopping } from "./setStopping";
