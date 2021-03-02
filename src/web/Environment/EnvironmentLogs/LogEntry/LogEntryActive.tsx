import React from "react";
import { Route, Link } from "react-router-dom";
import cx from "classnames";
import { useInView } from "react-hook-inview";

import type { EnvironmentCommand } from "../../../../lambda/common/entities";
import { LogOutput } from "../../../components/LogOutput";
import { StatusIndicator } from "../../../components/StatusIndicator";
import { useGetEnvironmentCommandLogsLazyQuery } from "../../../generated";
import { LogEntryProps } from ".";

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

export function LogEntryActive({
  commandId,
  dynamic,
  environmentId,
  logText,
  poll,
  status,
  title,
}: LogEntryProps) {
  const logExpandedPath = `/environment/${environmentId}/logs/${commandId}`;
  const [ref, inView] = useInView();
  const [logOutput, setLogOutput] = React.useState("");
  const [polling, setPolling] = React.useState(false);
  const [getLogs, { loading }] = useGetEnvironmentCommandLogsLazyQuery({
    onCompleted: (data) => {
      setPolling(false);
      if (!data?.environmentCommandLogs?.logs) return;
      setLogOutput(
        (previousOutput) => previousOutput + data.environmentCommandLogs?.logs
      );
    },
    onError: (error) => {
      setPolling(false);
      console.error(error);
    },
  });

  React.useEffect(() => {
    console.log("Log entry");

    if (!inView) {
      return;
    }

    if (inView && !polling) {
      getLogs({
        variables: {
          after: logOutput.length,
          commandId,
        },
      });
      setPolling(true);
    }

    if (!poll) {
      return;
    }
    const interval = setInterval(() => {
      if (!inView || polling) return;
      getLogs({
        variables: {
          after: logOutput.length,
          commandId,
        },
      });
      setPolling(true);
    }, 1000);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div className="mt-4">
      <div className={boxClassNamesByStatus[status]}>
        <div className="inline-block mr-4">
          <Status status={status as EnvironmentCommand["status"]} />
        </div>
        <Link to={logExpandedPath} className={textClassNamesByStatus[status]}>
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
