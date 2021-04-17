import { SetStoppedArguments } from ".";
import { log } from "../../../../common/logger";
import { environmentAction, environmentSnapshot } from "../../entities";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";
import { StateMachineReturnValue } from "../index";

export async function canSetStopped({
  environment,
  trx,
}: SetStoppedArguments): Promise<StateMachineReturnValue> {
  if (!environmentSnapshot) {
    return {
      errors: [
        "Can't set an environment to stopped if you don't associate a snapshot with it",
      ],
      operationSuccess: false,
    };
  }
  if (environment.lifecycleStatus !== "snapshotting") {
    return {
      errors: [
        "Environment cannot be set to stopping unless it's 'snapshotting'",
      ],
      operationSuccess: false,
    };
  }

  const action = await environmentAction.getByEnvironmentId(
    trx,
    environment.id
  );

  if (!action) {
    log.debug("Environment tried to set snapshotting");
    return {
      errors: ["Environment can't set snapshotting. No action created!"],
      operationSuccess: false,
    };
  }

  const actionInSource = await getExternalEnvironmentHandler(
    environment
  ).getAction(environment, action);

  if (!actionInSource) {
    log.error("Environment action doesn't exist in source", {
      environmentAction,
      actionInSource,
    });
    return {
      errors: ["Environment action doesn't exist in source"],
      operationSuccess: false,
    };
  }

  if (actionInSource.status === "errored") {
    log.error("Action in source errored!", {
      actionInSource,
    });
    return {
      errors: ["Action in source errored"],
      operationSuccess: false,
    };
  }

  if (actionInSource.status === "in-progress") {
    return {
      errors: ["Action in source is not yet complete"],
      operationSuccess: false,
    };
  }

  // Now, grab the snapshot so we can get the image ID
  const snapshot = await getExternalEnvironmentHandler(environment).getSnapshot(
    environment
  );
  if (!snapshot) {
    log.warn(
      "Expected environment to have a snapshot by now, but it doesn't...",
      {
        environment: environment.subdomain,
        snapshot,
      }
    );
    return {
      errors: [
        "Cannot set a environment to stopped if it has no snapshot! Otherwise, we couldn't start it again...",
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
