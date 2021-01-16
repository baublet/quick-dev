import React from "react";
import { Route, Link } from "react-router-dom";
import cx from "classnames";
import { useInView } from "react-hook-inview";

import type { EnvironmentCommand } from "../../../lambda/common/entities";
import { LogOutput } from "../../components/LogOutput";
import { StatusIndicator } from "../../components/StatusIndicator";

interface LogEntryProps {
  environmentId: string;
  title: string;
  logText?: string;
  commandId: string;
  status?: string;
}

const baseClassNames =
  "shadow-sm block p-4 border rounded-sm border-gray-400 text-gray-800 leading-5";

const boxClassNamesByStatus: Record<EnvironmentCommand["status"], string> = {
  waiting: baseClassNames,
  failed: cx(baseClassNames, "border-red-500"),
  running: cx(baseClassNames, "border-yellow-600"),
  success: cx(baseClassNames, "border-green-600"),
};

const baseTextClassNames = "";

const textClassNamesByStatus: Record<EnvironmentCommand["status"], string> = {
  waiting: baseTextClassNames,
  failed: cx(baseTextClassNames, "text-red-500"),
  running: cx(baseTextClassNames, "text-yellow-600"),
  success: cx(baseTextClassNames, "text-green-600"),
};

function Status({ status }: { status: EnvironmentCommand["status"] }) {
  switch (status) {
    case "failed":
      return <StatusIndicator status="red" alt="status" />;
    case "running":
      return <StatusIndicator status="yellow" alt="status" />;
    case "success":
      return <StatusIndicator status="green" alt="status" />;
    default:
      return <StatusIndicator status="none" alt="status" />;
  }
}

export function LogEntry({
  environmentId,
  title,
  logText,
  commandId,
  status = "waiting",
}: LogEntryProps) {
  const logExpandedPath = `/environment/${environmentId}/logs/${commandId}`;
  const [ref, inView] = useInView();
  return (
    <div className="mt-4">
      <div className={boxClassNamesByStatus[status]}>
        <div className="inline-block mr-4">
          <Status status={status as EnvironmentCommand["status"]} />
        </div>
        {status === "waiting" ? (
          <span className={textClassNamesByStatus.waiting}>{title}</span>
        ) : (
          <Link to={logExpandedPath} className={textClassNamesByStatus[status]}>
            {title}
          </Link>
        )}
      </div>
      <Route path={logExpandedPath}>
        <LogOutput logText={logText} />
      </Route>
    </div>
  );
}
