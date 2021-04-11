import React from "react";

import { H4 } from "../../components/H4";
import { LogEntry } from "./LogEntry";
import type { EnvironmentCommand } from "../../../server/graphql/generated";

interface EnvironmentLogsProps {
  environmentId: string;
  commands: EnvironmentCommand[];
}

export function EnvironmentLogs({
  environmentId,
  commands,
}: EnvironmentLogsProps) {
  return (
    <div>
      <H4>Logs</H4>
      {commands.map((command) => (
        <LogEntry
          environmentId={environmentId}
          key={command.id}
          status={command.status}
          commandId={command.id}
          title={command.title}
          dynamic={true}
        />
      ))}
    </div>
  );
}
