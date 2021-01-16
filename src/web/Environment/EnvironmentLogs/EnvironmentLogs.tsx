import React from "react";

import { H4 } from "../../components/H4";
import { StatusIndicator } from "../../components/StatusIndicator";
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
        commandId={"startup"}
        title={"Startup Logs"}
        logText={startupLogs}
        status={startupLogs ? "success" : "waiting"}
      />
      {commands.map((command) => (
        <LogEntry
          environmentId={environmentId}
          key={command.id}
          status={command.status}
          commandId={command.id}
          title={command.title}
        />
      ))}
    </div>
  );
}
