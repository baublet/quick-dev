import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetProvisioningArguments {
  environment: Environment;
  trx: Transaction;
}

export { canSetProvisioning } from "./canSetProvisioning";
export { setProvisioning } from "./setProvisioning";
