import { sendCommand } from "./sendCommand";
import { createEnvironmentCommands } from "./createEnvironmentCommands";
import { deleteEnvironmentInProvider } from "./deleteEnvironmentInProvider";
import { getEnvironmentCommandLogs } from "./getEnvironmentCommandLogs";
import { setupEnvironmentDomain } from "./setupEnvironmentDomain";
import { getEnvironmentStartupLogs } from "./getEnvironmentStartupLogs";

export const JOB_MAP = {
  sendCommand,
  createEnvironmentCommands,
  deleteEnvironmentInProvider,
  getEnvironmentCommandLogs,
  setupEnvironmentDomain,
  getEnvironmentStartupLogs,
} as const;

export type JobKey = keyof typeof JOB_MAP;
