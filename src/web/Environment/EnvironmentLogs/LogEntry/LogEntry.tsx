import React from "react";

import { LogEntryProps } from ".";
import { LogEntryActive } from "./LogEntryActive";
import { LogEntryCancelled } from "./LogEntryCancelled";

const statusMap: Record<
  LogEntryProps["status"],
  React.ElementType<LogEntryProps>
> = {
  cancelled: LogEntryCancelled,
  running: LogEntryActive,
  failed: LogEntryActive,
  success: LogEntryActive,
  ready: LogEntryActive,
  sending: LogEntryActive,
};

export function LogEntry(props: LogEntryProps) {
  const Component = statusMap[props.status];
  return <Component {...props} />;
}
