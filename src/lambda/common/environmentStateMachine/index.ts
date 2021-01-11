import { Environment } from "../entities";
import { setNew, canSetNew } from "./setNew";
import { setCreating, canSetCreating } from "./setCreating";
import { canSetProvisioning, setProvisioning } from "./setProvisioning";

export interface StateMachineReturnValue {
  operationSuccess: boolean;
  errors: string[];
  environment?: Environment;
}

export const environmentStateMachine = {
  canSetNew,
  setNew,

  canSetCreating,
  setCreating,

  canSetProvisioning,
  setProvisioning,
};
