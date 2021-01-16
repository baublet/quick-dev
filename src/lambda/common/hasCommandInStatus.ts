import { EnvironmentCommand } from "./entities";

export function hasCommandInStatus(
  envCommands: EnvironmentCommand[],
  status: EnvironmentCommand["status"]
): boolean {
  for (const command of envCommands) {
    if (command.status === status) return true;
  }
  return false;
}
