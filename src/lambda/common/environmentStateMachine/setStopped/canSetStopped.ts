import { SetStoppedArguments } from ".";
import { StateMachineReturnValue } from "../index";

export async function canSetStopped({
  environment,
}: SetStoppedArguments): Promise<StateMachineReturnValue> {
  if (environment.lifecycleStatus !== "stopping") {
    return {
      errors: ["Environment cannot be set to stopping unless it's 'stopping'"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
