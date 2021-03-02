import { Context } from "../../../common/context";
import { Environment } from "../../../common/entities";
import { environmentStateMachine } from "../../../common/environmentStateMachine";

export async function environmentPermissions(
  parent: Environment,
  args: unknown,
  context: Context
) {
  return {
    canDelete: async () =>
      (
        await environmentStateMachine.canSetDeleted({
          context,
          environment: parent,
        })
      ).operationSuccess,
    canOpen: async () => {
      if (parent.lifecycleStatus !== "ready") {
        return false;
      }
      if (context.user?.email !== parent.user) {
        return false;
      }
      return true;
    },
  };
}
