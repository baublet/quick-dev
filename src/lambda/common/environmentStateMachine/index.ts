import { Environment } from "../entities";
import { setNew, canSetNew } from "./setNew";
import { setCreating, canSetCreating } from "./setCreating";
import { canSetProvisioning, setProvisioning } from "./setProvisioning";
import { canSetDeleted, setDeleted } from "./setDeleted";
import {
  canSetErrorProvisioning,
  setErrorProvisioning,
} from "./setErrorProvisioning";
import {
  setFinishedProvisioning,
  canSetFinishedProvisioning,
} from "./setFinishedProvisioning";
import { canSetReady, setReady } from "./setReady";
import { canSetStopping, setStopping } from "./setStopping";

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

  canSetErrorProvisioning,
  setErrorProvisioning,

  canSetFinishedProvisioning,
  setFinishedProvisioning,

  canSetDeleted,
  setDeleted,

  canSetReady,
  setReady,

  canSetStopping,
  setStopping,
};
