import {
  environmentAction,
  Environment,
  environmentDomainRecord,
} from "../../entities";
import { Transaction } from "../../db";
import { environmentStateMachine } from "../../environmentStateMachine";
import { log } from "../../../../common/logger";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";

export async function processStoppingEnvironment(
  trx: Transaction,
  environment: Environment
) {
  const existingAction = await environmentAction.getByEnvironmentId(
    trx,
    environment.id
  );

  if (!existingAction) {
    // Create it! Rare that it can get here, but possible
    const domains = await environmentDomainRecord.getByEnvironmentId(
      trx,
      environment.id
    );
    const action = await DigitalOceanHandler.shutdownEnvironment(
      environment,
      domains
    );
    const savedAction = await environmentAction.create(trx, {
      environmentId: environment.id,
      actionPayload: JSON.stringify(action),
    });
    log.debug(`Environment ${environment.subdomain} shutting down`, {
      environment: environment.subdomain,
      environmentAction: savedAction,
    });
    return;
  }

  if (existingAction) {
    // Check the action status
    const action = await DigitalOceanHandler.getAction(
      environment,
      existingAction
    );
    switch (action.status) {
      case "completed": {
        // TODO: delete the old action from the local DB, send the snapshot
        // TODO: action to the source, save the new action, and advance to
        // TODO: the environment to the next state.
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
}
