import type { EnvironmentCommand } from "../../../../server/common/entities";

export interface LogEntryProps {
  commandId: string;
  environmentId: string;
  status: EnvironmentCommand["status"];
  title: string;
}

export { LogEntry } from "./LogEntry";
