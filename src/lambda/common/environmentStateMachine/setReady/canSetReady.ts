import { SetReadyArguments } from ".";
import { StateMachineReturnValue } from "../index";

export async function canSetReady({
  environment,
}: SetReadyArguments): Promise<StateMachineReturnValue> {
  if (environment.lifecycleStatus !== "finished_provisioning") {
    return {
      errors: ["Environment cannot be ready if it's not finished provisioning"],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
