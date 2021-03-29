import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetProvisioningArguments {
  environment: Environment;
  trx: Transaction;
}

export { canSetErrorProvisioning } from "./canSetErrorProvisioning";
export { setErrorProvisioning } from "./setErrorProvisioning";
