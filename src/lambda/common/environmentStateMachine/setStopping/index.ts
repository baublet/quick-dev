import { Transaction } from "../../db";
import { Environment, EnvironmentDomainRecord } from "../../entities";

export interface SetStoppingArguments {
  trx: Transaction;
  environment: Environment;
  environmentDomainRecords: EnvironmentDomainRecord[];
}

export { canSetStopping } from "./canSetStopping";
export { setStopping } from "./setStopping";
