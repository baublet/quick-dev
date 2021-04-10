import { ConnectionOrTransaction } from "../../db";
import { Environment } from "../../entities";

export interface SetStartingFromSnapshotArguments {
  trx: ConnectionOrTransaction;
  environment: Environment;
}

export { canSetStartingFromSnapshot } from "./canSetStartingFromSnapshot";
export { setStartingFromSnapshot } from "./setStartingFromSnapshot";
