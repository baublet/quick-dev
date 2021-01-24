import type { EnvironmentCommand } from "../../../../lambda/common/entities";

export interface LogEntryProps {
  commandId: string;
  dynamic: boolean;
  environmentId: string;
  logText?: string;
  poll: boolean;
  status: EnvironmentCommand["status"];
  title: string;
}

export { LogEntry } from "./LogEntry";
