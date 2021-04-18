import { SetStartingFromSnapshotArguments } from ".";
import { StateMachineReturnValue } from "../index";

export async function canSetStartingFromSnapshot({
  environment,
  trx,
}: SetStartingFromSnapshotArguments): Promise<StateMachineReturnValue> {
  if (!environment.sourceSnapshotId) {
    return {
      errors: [
        "Can't start an environment from snapshot that doesn't have a source snapshot ID",
      ],
      operationSuccess: false,
    };
  }
  if (environment.lifecycleStatus !== "stopped") {
    return {
      errors: [
        "Environment cannot be set to starting from snapshot unless it's stopped",
      ],
      operationSuccess: false,
    };
  }

  if (!environment.sourceSnapshotId) {
    return {
      errors: [
        "Environment cannot start from a snapshot because it doesn't have a snapshot!",
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}