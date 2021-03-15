import { checkEnvironmentCommandStatus } from "./checkEnvironmentCommandStatus";
import { createEnvironmentCommands } from "./createEnvironmentCommands";
import { deleteEnvironmentInProvider } from "./deleteEnvironmentInProvider";
import { getEnvironmentCommandLogs } from "./getEnvironmentCommandLogs";
import { getEnvironmentStartupLogs } from "./getEnvironmentStartupLogs";
import { processEnvironment } from "./processEnvironment";
import { rescueStuckEnvironments } from "./rescueStuckEnvironments";
import { sendCommand } from "./sendCommand";
import { setupEnvironmentDomain } from "./setupEnvironmentDomain";
import { updateEnvironmentStrapYardUrls } from "./updateEnvironmentStrapYardUrls";

export const JOB_MAP = {
  checkEnvironmentCommandStatus,
  createEnvironmentCommands,
  deleteEnvironmentInProvider,
  getEnvironmentCommandLogs,
  getEnvironmentStartupLogs,
  processEnvironment,
  rescueStuckEnvironments,
  sendCommand,
  setupEnvironmentDomain,
  updateEnvironmentStrapYardUrls,
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
