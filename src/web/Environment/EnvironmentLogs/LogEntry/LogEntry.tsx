import React from "react";
import { Route, Link, useLocation } from "react-router-dom";
import cx from "classnames";
import { useInView } from "react-hook-inview";

import type { EnvironmentCommand } from "../../../../server/common/entities";
import { LogOutput } from "../../../components/LogOutput";
import { StatusIndicator } from "../../../components/StatusIndicator";
import { useGetEnvironmentCommandLogsLazyQuery } from "../../../generated";
import { LogEntryProps } from ".";

const hasLogs: Record<EnvironmentCommand["status"], boolean> = {
  cancelled: true,
  failed: true,
  ready: false,
  running: false,
  sending: false,
  success: true,
};

const baseClassNames = "block text-gray-800 leading-5";

const boxClassNamesByStatus: Record<EnvironmentCommand["status"], string> = {
  ready: baseClassNames,
  sending: baseClassNames,
  cancelled: baseClassNames,
  failed: cx(baseClassNames, "border-red-500"),
  running: cx(baseClassNames, "border-yellow-600"),
  success: cx(baseClassNames, "border-green-600"),
};

const baseTextClassNames = "";

const textClassNamesByStatus: Record<EnvironmentCommand["status"], string> = {
  ready: baseTextClassNames,
  sending: baseTextClassNames,
  cancelled: baseTextClassNames,
  failed: cx(
    baseTextClassNames,
    "text-red-500 hover:text-red-900 hover:underline"
  ),
  running: cx(
    baseTextClassNames,
    "text-yellow-600 hover:text-yellow-900 hover:underline"
  ),
  success: cx(
    baseTextClassNames,
    "text-green-600 hover:text-green-900 hover:underline"
  ),
};

function Status({ status }: { status: EnvironmentCommand["status"] }) {
  switch (status) {
    case "failed":
      return <StatusIndicator status="red" alt="failed" />;
    case "running":
      return <StatusIndicator status="yellow" alt="running" />;
    case "success":
      return <StatusIndicator status="green" alt="success" />;
    default:
      return <StatusIndicator status="none" alt="status" />;
  }
}

export function LogEntry({
  commandId,
  dynamic,
  environmentId,
  logText,
  status,
  title,
}: LogEntryProps) {
  const { pathname } = useLocation();
  const logExpandedPath = `/environment/${environmentId}/logs/${commandId}`;
  const linkPath =
    logExpandedPath === pathname
      ? `/environment/${environmentId}/logs/`
      : logExpandedPath;
  const [ref, inView] = useInView();
  const [logOutput, setLogOutput] = React.useState<string | undefined>();
  const [getLogs, { loading }] = useGetEnvironmentCommandLogsLazyQuery({
    onCompleted: (data) =>
      setLogOutput(data.environmentCommandLogs?.logs || "No log output"),
    onError: (error) => console.error(error),
  });

  React.useEffect(() => {
    if (!inView) {
      return;
    }

    if (
      inView &&
      !loading &&
      hasLogs[status] &&
      typeof logOutput !== "string"
    ) {
      getLogs({
        variables: {
          after: 0,
          commandId,
        },
      });
    }
  }, [inView]);

  return (
    <div className="mt-4">
      <div className={boxClassNamesByStatus[status]}>
        <div className="inline-block mr-2">
          <Status status={status as EnvironmentCommand["status"]} />
        </div>
        <Link to={linkPath} className={textClassNamesByStatus[status]} replace>
          {title}
        </Link>
      </div>
      <Route path={logExpandedPath}>
        <div className="mt-2">
          <LogOutput logText={!dynamic ? logText : logOutput} />
        </div>
        {!dynamic ? null : <div ref={ref} />}
      </Route>
    </div>
  );
}
