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
  const environment = await context.service(loader).load(id);
  return context.db.transaction(async (trx) => {

    if (!environment) {
      log.error("Deletion request rejected: environment not found", { context, environment });
      return {
        errors: ["Environment not found"],
      };
    }

    if(!canDelete(context, environment)) {
      log.error("Deletion request unauthorized", { context, environment });
      return {
        errors: ["Environment not found"],
      };
    }

    try {
      log.info("Attempting to delete environment", {
        environment,
      });
      await Promise.all([
        del(trx, id),
        enqueueJob(trx, "deleteEnvironmentInProvider", {
          environmentId: id,
        }),
      ]);
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
