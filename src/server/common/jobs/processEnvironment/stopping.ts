import {
  environmentAction,
  Environment,
  environmentDomainRecord,
} from "../../entities";
import { Transaction } from "../../db";
import { log } from "../../../../common/logger";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";
import { environmentStateMachine } from "../../environmentStateMachine";

export async function processStoppingEnvironment(
  trx: Transaction,
  environment: Environment
) {
  const existingAction = await environmentAction.getByEnvironmentId(
    trx,
    environment.id
  );

  log.info("processStoppingEnvironment", {
    environment: environment.subdomain,
    action: existingAction?.actionPayload,
  });

  if (!existingAction) {
    // Create it! Unusual that it can get here, but possible
    const domains = await environmentDomainRecord.getByEnvironmentId(
      trx,
      environment.id
    );
    const action = await getExternalEnvironmentHandler(
      environment
    ).shutdownEnvironment(environment, domains);
    const savedAction = await environmentAction.create(trx, {
      environmentId: environment.id,
      actionPayload: JSON.stringify(action),
    });
    log.warn(`Environment ${environment.subdomain} shutting down`, {
      environment: environment.subdomain,
      environmentAction: savedAction,
    });
    return;
  }

  // Check the action status
  const action = await getExternalEnvironmentHandler(environment).getAction(
    environment,
    existingAction
  );

  switch (action.status) {
    case "completed": {
      const result = await environmentStateMachine.setSnapshotting({
        trx,
        environment,
      });
      if (!result.operationSuccess) {
        log.error(
          "Unexpected error. Environment could not be set to 'snapshotting' after being shut down",
          {
            errors: result.errors,
            environment: environment.subdomain,
          }
        );
        return;
      }
      break;
    }
    case "in-progress":
      return;
    default:
      log.error(
        `Unhandled source action status type while waiting for stop action for ${environment.subdomain}`,
        {
          action,
          existingAction,
        }
      );
  }
}
