import { Transaction } from "../../db";
import { Environment } from "../../entities";

export interface SetSnapshottingArguments {
  trx: Transaction;
  environment: Environment;
}

export { canSetSnapshotting } from "./canSetSnapshotting";
export { setSnapshotting } from "./setSnapshotting";
