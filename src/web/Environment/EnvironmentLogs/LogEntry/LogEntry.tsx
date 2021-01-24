import React from "react";

import { LogEntryProps } from ".";
import { LogEntryActive } from "./LogEntryActive";
import { LogEntryCancelled } from "./LogEntryCancelled";
import { LogEntryWaiting } from "./LogEntryWaiting";

const statusMap: Record<
  LogEntryProps["status"],
  React.ElementType<LogEntryProps>
> = {
  cancelled: LogEntryCancelled,
  waiting: LogEntryWaiting,
  running: LogEntryActive,
  failed: LogEntryActive,
  success: LogEntryActive,
};

export function LogEntry(props: LogEntryProps) {
  const Component = statusMap[props.status];
  return <Component {...props} />;
}
