import { SetFinishedProvisioningArguments } from ".";
import { EnvironmentCommand } from "../../entities";
import { StateMachineReturnValue } from "../index";

function hasOneOrMoreCommandInIncompleteOrFailedStatus(
  environmentCommands: EnvironmentCommand[]
): boolean {
  for (const command of environmentCommands) {
    if (command.status === "running") return true;
    if (command.status === "cancelled") return true;
    if (command.status === "failed") return true;
    if (command.status === "ready") return true;
    if (command.status === "sending") return true;
  }
  return false;
}

export async function canSetFinishedProvisioning({
  environment,
  environmentCommands,
}: SetFinishedProvisioningArguments): Promise<StateMachineReturnValue> {
  if (environment.lifecycleStatus !== "provisioning") {
    return {
      errors: [
        "Environment cannot be finished provisioning if it's not currently provisioning",
      ],
      operationSuccess: false,
    };
  }

  if (hasOneOrMoreCommandInIncompleteOrFailedStatus(environmentCommands)) {
    return {
      errors: [
        "Environment has commands that are either in flight, cancelled, or failed.",
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
