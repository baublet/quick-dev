import React from "react";
import { Route, Link } from "react-router-dom";

import { LogOutput } from "../../components/LogOutput";

interface LogEntryProps {
  environmentId: string | number;
  title: string;
  logText?: string;
  logId: string;
}

export function LogEntry({
  environmentId,
  title,
  logText,
  logId,
}: LogEntryProps) {
  const logExpandedPath = `/environment/${environmentId}/logs/${logId}`;
  return (
    <div className="mt-4">
      <div>
        <Link
          to={logExpandedPath}
          className="shadow-sm block p-2 border rounded-sm border-gray-400 font-bold text-gray-800"
        >
          {title}
        </Link>
      </div>
      <Route path={logExpandedPath}>
        <LogOutput logText={logText} />
      </Route>
    </div>
  );
}
