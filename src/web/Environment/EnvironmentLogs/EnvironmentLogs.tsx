import React from "react";

import { H4 } from "../../components/H4";
import { LogEntry } from "./LogEntry";
import type { EnvironmentCommand } from "../../../lambda/graphql/generated";

interface EnvironmentLogsProps {
  environmentId: string;
  startupLogs: string;
  commands: EnvironmentCommand[];
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
        status={startupLogs ? "success" : "ready"}
        dynamic={false}
        poll={false}
      />
      {commands.map((command) => (
        <LogEntry
          environmentId={environmentId}
          key={command.id}
          status={command.status}
          commandId={command.id}
          title={command.title}
          dynamic={true}
          poll={true}
        />
      ))}
    </div>
  );
}
