import { SetNewArguments } from ".";
import { StateMachineReturnValue } from "../";

export async function canSetNew(
  _args: SetNewArguments
): Promise<StateMachineReturnValue> {
  return {
    errors: [],
    operationSuccess: true,
  };
}
