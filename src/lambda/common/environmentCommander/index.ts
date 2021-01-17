import { canSendNextCommand, sendNextCommand } from "./sendNextCommand";
import { isComplete } from "./isComplete";
import { handleCommandComplete } from "./handleCommandComplete";

export interface EnvironmentCommanderReturn {
  operationSuccess: boolean;
  errors: string[];
}

export const environmentCommander = {
  canSendNextCommand,
  sendNextCommand,
  isComplete,
  handleCommandComplete,
};
