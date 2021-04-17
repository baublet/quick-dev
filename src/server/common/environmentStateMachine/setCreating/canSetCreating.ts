import { SetCreatingArguments } from ".";
import { StateMachineReturnValue } from "..";
import { log } from "../../../../common/logger";
import { getExternalEnvironmentHandler } from "../../externalEnvironmentHandler";

export async function canSetCreating({
  environment,
}: SetCreatingArguments): Promise<StateMachineReturnValue> {
  if (environment.deleted === true) {
    return {
      operationSuccess: false,
      errors: ["Environment is deleted"],
    };
  }

  const externalEnvironmentExists = await getExternalEnvironmentHandler(
    environment
  ).environmentExists(environment);

  if (externalEnvironmentExists !== false) {
    log.warn(
      "Environment tried to be flipped to 'creating' when it was already created in the external environment. FIX THIS",
      {
        environment,
        externalEnvironmentExists,
      }
    );
    return {
      operationSuccess: false,
      errors: ["External environment already created"],
    };
  }

  if (environment.lifecycleStatus === "new") {
    return {
      operationSuccess: true,
      errors: [],
    };
  }

  return {
    operationSuccess: false,
    errors: [
      "Environment can't be moved to 'creating' unless it starts in 'new'",
    ],
  };
}
