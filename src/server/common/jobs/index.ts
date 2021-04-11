import { createEnvironmentCommands } from "./createEnvironmentCommands";
import { deleteEnvironmentInProvider } from "./deleteEnvironmentInProvider";
import { processEnvironment } from "./processEnvironment";
import { removeAllTrace } from "./removeAllTrace";
import { rescueStuckEnvironments } from "./rescueStuckEnvironments";
import { sendCommand } from "./sendCommand";
import { setupEnvironmentDomain } from "./setupEnvironmentDomain";
import { deleteEnvironmentSnapshots } from "./deleteEnvironmentSnapshots";

export const JOB_MAP = {
  createEnvironmentCommands,
  deleteEnvironmentInProvider,
  deleteEnvironmentSnapshots,
  processEnvironment,
  removeAllTrace,
  rescueStuckEnvironments,
  sendCommand,
  setupEnvironmentDomain,
} as const;

export type JobKey = keyof typeof JOB_MAP;
export const knownJobTypes = Object.keys(JOB_MAP);
export type Jobs = typeof JOB_MAP;
export type JobQueuePayload = {
  [K in keyof Jobs]: { job: K; payload: Parameters<Jobs[K]>[0] };
}[keyof Jobs];
export type JobPayload = {
  [K in keyof Jobs]: Parameters<Jobs[K]>[0];
};
