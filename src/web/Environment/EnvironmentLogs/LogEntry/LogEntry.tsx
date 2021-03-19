import React from "react";
import { Route, Link } from "react-router-dom";
import cx from "classnames";
import { useInView } from "react-hook-inview";

import type { EnvironmentCommand } from "../../../../lambda/common/entities";
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

const baseClassNames =
  "shadow-sm block p-4 border rounded-sm border-gray-400 text-gray-800 leading-5";

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
  failed: cx(baseTextClassNames, "text-red-500"),
  running: cx(baseTextClassNames, "text-yellow-600"),
  success: cx(baseTextClassNames, "text-green-600"),
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
  const logExpandedPath = `/environment/${environmentId}/logs/${commandId}`;
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
        <div className="inline-block mr-4">
          <Status status={status as EnvironmentCommand["status"]} />
        </div>
        <Link
          to={logExpandedPath}
          className={textClassNamesByStatus[status]}
          replace
        >
          {title}
        </Link>
      </div>
      <Route path={logExpandedPath}>
        <LogOutput
          logText={!dynamic ? logText : logOutput}
          streaming={status === "running" || loading}
        />
        {!dynamic ? null : <div ref={ref} />}
      </Route>
    </div>
  );
}
