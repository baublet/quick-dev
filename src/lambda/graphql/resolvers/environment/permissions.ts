import { Context } from "../../../common/context";
import { Environment } from "../../../common/entities";
import { canDelete } from "../../authorization/environment/canDelete";

export async function environmentPermissions(
  parent: Environment,
  args: unknown,
  context: Context
) {
  return {
    canDelete: () => canDelete(context, parent),
  };
}