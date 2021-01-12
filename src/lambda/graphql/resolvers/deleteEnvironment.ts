import { log } from "../../../common/logger";
import { Context } from "../../common/context";
import { Environment, environment as envEntity } from "../../common/entities";
import { environmentStateMachine } from "../../common/environmentStateMachine";

interface DeleteEnvironmentArguments {
  input: {
    id: string;
  };
}

export async function deleteEnvironment(
  _parent: unknown,
  { input: { id } }: DeleteEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  const environment = await context.service(envEntity.loader).load(id);
  return context.db.transaction(async (trx) => {
    if (!environment) {
      log.error("Deletion request rejected: environment not found", {
        context,
        environment,
      });
      return {
        errors: ["Environment not found"],
      };
    }

    if (!environmentStateMachine.canSetDeleted({ context, environment })) {
      log.error("Deletion request unauthorized", { context, environment });
      return {
        errors: ["Environment not found"],
      };
    }

    try {
      await environmentStateMachine.setDeleted({ context, environment });
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
