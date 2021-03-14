import { Transaction } from "../../db";
import { Environment, EnvironmentDomainRecord } from "../../entities";

export interface SetStoppedArguments {
  trx: Transaction;
  environment: Environment;
}

export { canSetStopped } from "./canSetStopped";
export { setStopped } from "./setStopped";
