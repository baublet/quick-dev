import { SetSnapshottingArguments } from ".";
import { StateMachineReturnValue } from "../index";

export async function canSetSnapshotting({
  environment,
}: SetSnapshottingArguments): Promise<StateMachineReturnValue> {
  if (environment.lifecycleStatus !== "stopping") {
    return {
      errors: [
        "Environment cannot be set to snapshotting unless it's stopping",
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
