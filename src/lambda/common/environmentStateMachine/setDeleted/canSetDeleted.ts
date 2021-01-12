import { StateMachineReturnValue } from "..";
import { Context } from "../../context";
import { Environment } from "../../entities";

export async function canSetDeleted({
  context,
  environment,
}: {
  context: Context;
  environment: Environment;
}): Promise<StateMachineReturnValue> {
  const userSource = context.user.source;
  const user = context.user.email;

  if (environment.user !== user || environment.userSource !== userSource) {
    return {
      errors: ["You don't own this environment"],
      operationSuccess: false,
    };
  }
  return {
    errors: [],
    operationSuccess: true,
  };
}
