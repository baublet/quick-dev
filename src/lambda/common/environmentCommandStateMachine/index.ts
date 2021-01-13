import { setSuccess } from "./setSuccess";
import { setFailed } from "./setFailed";
import { setRunning } from "./setRunning";

export interface EnvironmentCommandStateMachineReturn {
  operationSuccess: boolean;
  errors: string[];
}

export const environmentCommandStateMachine = {
  setSuccess,
  setFailed,
  setRunning,
};
