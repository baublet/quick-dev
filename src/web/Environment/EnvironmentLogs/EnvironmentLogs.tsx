import React from "react";

import { H4 } from "../../components/H4";
import { LogEntry } from "./LogEntry";
import { EnvironmentDetailsQuery } from "../../generated";

interface EnvironmentLogsProps {
  environmentId: string;
  startupLogs: string;
  commands: Required<
    EnvironmentDetailsQuery["environment"]["logs"]["commands"]
  >;
}

export function EnvironmentLogs({
  startupLogs,
  environmentId,
  commands,
}: EnvironmentLogsProps) {
  return (
    <div>
      <H4>Logs</H4>
      <LogEntry
        environmentId={environmentId}
        key={"startup"}
        logId={"startup"}
        title={"Startup Logs"}
        logText={startupLogs}
      />
      {commands.map((command) => (
        <LogEntry
          environmentId={environmentId}
          key={command.id}
          logId={command.id}
          title={command.title}
          logText={command.logChunks.map((chunk) => chunk.data).join("")}
        />
      ))}
    </div>
  );
}
