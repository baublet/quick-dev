import React from "react";

import { H4 } from "../../components/H4";
import { LogEntry } from "./LogEntry";

interface EnvironmentLogsProps {
  environmentId: string | number;
  startupLogs: string;
}

export function EnvironmentLogs({
  startupLogs,
  environmentId,
}: EnvironmentLogsProps) {
  const logs: {
    logId: string;
    title: string;
    logText?: string;
  }[] = [
    {
      logId: "startup",
      title: "Startup Logs",
      logText: startupLogs,
    },
  ];
  return (
    <div>
      <H4>Logs</H4>
      {logs.map((log) => (
        <LogEntry
          environmentId={environmentId}
          key={log.logId}
          logId={log.logId}
          title={log.title}
          logText={log.logText}
        />
      ))}
    </div>
  );
}
