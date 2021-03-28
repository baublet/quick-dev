import { SetStoppedArguments } from ".";
import { log } from "../../../../common/logger";
import { environmentAction } from "../../entities";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { StateMachineReturnValue } from "../index";

export async function canSetStopped({
  environment,
  trx,
}: SetStoppedArguments): Promise<StateMachineReturnValue> {
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

  const actionInSource = await DigitalOceanHandler.getAction(
    environment,
    action
  );

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

  return {
    errors: [],
    operationSuccess: true,
  };
}
