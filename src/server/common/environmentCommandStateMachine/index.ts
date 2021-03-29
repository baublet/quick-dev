import { setSuccess, canSetSuccess } from "./setSuccess";
import { setFailed, canSetFailed } from "./setFailed";
import { setRunning, canSetRunning } from "./setRunning";
import { setSending, canSetSending } from "./setSending";
import { setCancelled, canSetCancelled } from "./setCancelled";

export interface EnvironmentCommandStateMachineReturn {
  operationSuccess: boolean;
  errors: string[];
}

export const transitions = {
  success: {
    circuit: canSetSuccess,
    transition: setSuccess,
  },
  failed: {
    circuit: canSetFailed,
    transition: setFailed,
  },
  running: {
    circuit: canSetRunning,
    transition: setRunning,
  },
  sending: {
    circuit: canSetSending,
    transition: setSending,
  },
  cancelled: {
    circuit: canSetCancelled,
    transition: setCancelled,
  },
} as const;

export const environmentCommandStateMachine = {
  canSetSuccess,
  setSuccess,

  canSetFailed,
  setFailed,

  canSetRunning,
  setRunning,

  canSetSending,
  setSending,

  canSetCancelled,
  setCancelled,
};
