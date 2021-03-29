import { Transaction } from "../../db";
import { Environment, EnvironmentCommand } from "../../entities";

export interface SetFinishedProvisioningArguments {
  trx: Transaction;
  environment: Environment;
  environmentCommands: EnvironmentCommand[];
}

export { canSetFinishedProvisioning } from "./canSetFinishedProvisioning";
export { setFinishedProvisioning } from "./setFinishedProvisioning";
