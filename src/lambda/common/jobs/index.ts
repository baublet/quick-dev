import { sendCommand } from "./sendCommand";
import { createEnvironmentCommands } from "./createEnvironmentCommands";
import { deleteEnvironmentInProvider } from "./deleteEnvironmentInProvider";
import { getEnvironmentCommandLogs } from "./getEnvironmentCommandLogs";
import { setupEnvironmentDomain } from "./setupEnvironmentDomain";
import { getEnvironmentStartupLogs } from "./getEnvironmentStartupLogs";
import { processEnvironment } from "./processEnvironment";
import { checkEnvironmentCommandStatus } from "./checkEnvironmentCommandStatus";

export const JOB_MAP = {
  checkEnvironmentCommandStatus,
  createEnvironmentCommands,
  deleteEnvironmentInProvider,
  getEnvironmentCommandLogs,
  getEnvironmentStartupLogs,
  processEnvironment,
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
