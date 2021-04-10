import { Environment } from "../../entities";

import { SetReadyArguments } from ".";
import { StateMachineReturnValue } from "../index";

const validStatuses: Environment["lifecycleStatus"][] = [
  "starting_from_snapshot",
  "finished_provisioning",
];

export async function canSetReady({
  environment,
}: SetReadyArguments): Promise<StateMachineReturnValue> {
  if (!validStatuses.includes(environment.lifecycleStatus)) {
    return {
      errors: [
        "Environment cannot be ready if it's not in the right status. Received status: " +
          environment.lifecycleStatus,
      ],
      operationSuccess: false,
    };
  }

  return {
    errors: [],
    operationSuccess: true,
  };
}
