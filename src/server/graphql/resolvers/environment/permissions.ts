import { Context } from "../../../common/context";
import { Environment } from "../../../common/entities";
import { environmentStateMachine } from "../../../common/environmentStateMachine";

export async function environmentPermissions(
  environment: Environment,
  args: unknown,
  context: Context
) {
  const userRecord = context.getUserOrFail().user;
  return {
    canDelete: async () =>
      (
        await environmentStateMachine.canSetDeleted({
          context,
          environment: environment,
        })
      ).operationSuccess,
    canOpen: async () => {
      if (environment.lifecycleStatus !== "ready") {
        return false;
      }
      if (userRecord.id !== environment.userId) {
        return false;
      }
      return true;
    },
    canStop: async () => {
      if (environment.lifecycleStatus !== "ready") {
        return false;
      }
      if (userRecord.id !== environment.userId) {
        return false;
      }
      return true;
    },
    canStart: async () => {
      return environment.lifecycleStatus === "stopped";
    },
  };
}
