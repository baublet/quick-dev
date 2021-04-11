import { StateMachineReturnValue } from "..";
import { log } from "../../../../common/logger";
import { canSetDeleted } from "./canSetDeleted";
import { Context } from "../../context";
import { enqueueJob } from "../../enqueueJob";
import { Environment, environment as envEntity } from "../../entities";

export function setDeleted({
  context,
  environment,
}: {
  context: Context;
  environment: Environment;
}): Promise<StateMachineReturnValue> {
  return context.db.transaction(async (trx) => {
    const canContinue = await canSetDeleted({ context, environment });
    if (!canContinue.operationSuccess) {
      return canContinue;
    }
    try {
      log.info("Attempting to delete environment", {
        id: environment.id,
        environmentName: environment.name,
      });
      await Promise.all([
        envEntity.del(trx, environment.id),
        enqueueJob("removeAllTrace", {
          environmentId: environment.id,
        }),
      ]);
    } catch (e) {
      log.error("Deletion request failed", {
        context,
        environment: environment.subdomain,
        error: e.message,
        stack: e.stack,
      });
      return {
        errors: [e.message],
        operationSuccess: false,
      };
    }

    return {
      operationSuccess: true,
      errors: [],
    };
  });
}
