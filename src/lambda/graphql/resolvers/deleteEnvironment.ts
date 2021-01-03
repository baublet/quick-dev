import { log } from "../../../common/logger";
import { Context } from "../../common/context";
import { enqueueJob } from "../../common/enqueueJob";
import { del, Environment, loader } from "../../common/environment";
import { canDelete } from "../authorization/environment/canDelete";

interface DeleteEnvironmentArguments {
  input: {
    id: number;
  };
}

export async function deleteEnvironment(
  _parent: unknown,
  { input: { id } }: DeleteEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  return context.db.transaction(async (trx) => {
    const environment = await context.service(loader).load(id);

    if (!environment || !canDelete(context, environment)) {
      log.error("Deletion request rejected", { context, environment });
      return {
        errors: ["Environment not found"],
      };
    }

    try {
      await del(trx, id);
      await enqueueJob(trx, "deleteEnvironmentInProvider", {
        environmentId: id,
      });
    } catch (e) {
      log.error("Deletion request failed", {
        context,
        environment,
        error: e.message,
        stack: e.stack,
      });
      return {
        errors: [e.message],
      };
    }

    return {
      environment: {
        ...environment,
        deleted: true,
      },
      errors: [],
    };
  });
}
