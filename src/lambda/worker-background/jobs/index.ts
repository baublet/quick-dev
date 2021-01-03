import { sendCommand } from "./sendCommand";
import { createEnvironmentCommands } from "./createEnvironmentCommands";
import { deleteEnvironmentInProvider } from "./deleteEnvironmentInProvider";

export const JOB_MAP = {
  sendCommand,
  createEnvironmentCommands,
  deleteEnvironmentInProvider,
} as const;

export type JobKey = keyof typeof JOB_MAP;
