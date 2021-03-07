import { SetReadyArguments } from ".";
import { StateMachineReturnValue } from "../index";

export async function canSetStopping({
  environment,
}: SetReadyArguments): Promise<StateMachineReturnValue> {
  if (environment.lifecycleStatus !== "ready") {
    return {
      errors: ["Environment cannot be set to stopping unless it's 'ready'"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
