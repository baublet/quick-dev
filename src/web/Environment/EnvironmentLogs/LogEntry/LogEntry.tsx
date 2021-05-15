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
  environmentId,
  status,
  title,
}: LogEntryProps) {
  const { pathname } = useLocation();
  const logExpandedPath = `/environment/${environmentId}/logs/${commandId}`;
  const linkPath =
    logExpandedPath === pathname
      ? `/environment/${environmentId}/logs/`
      : logExpandedPath;

  const [tailRef, tailInView] = useInView();
  const [headRef, headInView] = useInView();

  const [lastCursor, setLastCursor] = React.useState<string>();
  const [firstCursor, setFirstCursor] = React.useState<string>();
  const [logData, setLogData] = React.useState("");

  const [
    tail,
    { loading: tailLoading },
  ] = useGetEnvironmentCommandLogsLazyQuery({
    onError: (error) => console.error(error),
    onCompleted: (data) => {
      const results = data?.environmentCommandLogs?.edges || [];
      if (results.length === 0) {
        return;
      }
      setLogData(
        (data) => data + results.map((result) => result.node.logOutput).join("")
      );
      setLastCursor(results[results.length - 1].cursor);
      if (!firstCursor) {
        setFirstCursor(results[0].cursor);
      }
    },
  });

  const [
    head,
    { loading: headLoading },
  ] = useGetEnvironmentCommandLogsLazyQuery({
    onError: (error) => console.error(error),
    onCompleted: (data) => {
      const results = data?.environmentCommandLogs?.edges || [];
      if (results.length === 0) {
        return;
      }
      setLogData(
        (data) => results.map((result) => result.node.logOutput).join("") + data
      );
      setFirstCursor(results[0].cursor);
    },
  });

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!tailInView) {
  //       return;
  //     }
  //     if (!hasLogs[status]) {
  //       return;
  //     }
  //     if (tailLoading) {
  //       return;
  //     }
  //     tail({
  //       variables: {
  //         last: 10,
  //         before: lastCursor,
  //         commandId,
  //       },
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [tailInView, lastCursor]);

  // By default, load the last 100 lines
  React.useEffect(() => {
    tail({
      variables: {
        last: 5,
        commandId,
      },
    });
  }, []);

  return (
    <div className="mt-4">
      <div className={boxClassNamesByStatus[status]}>
        <div className="inline-block mr-2">
          <Status status={status as EnvironmentCommand["status"]} />
        </div>
        {["success", "failed", "running"].includes(status) ? (
          <Link
            to={linkPath}
            className={textClassNamesByStatus[status]}
            replace
          >
            {title}
          </Link>
        ) : (
          <span className={textClassNamesByStatus[status]}>{title}</span>
        )}
      </div>
      <Route path={logExpandedPath}>
        <div className="mt-2">
          <button
            onClick={() => {
              head({
                variables: {
                  last: 5,
                  before: firstCursor,
                  commandId,
                },
              });
            }}
          >
            More
          </button>
          <LogOutput logText={logData} footer={<div ref={tailRef} />} />
          <button
            onClick={() => {
              tail({
                variables: {
                  first: 5,
                  after: lastCursor,
                  commandId,
                },
              });
            }}
          >
            More
          </button>
        </div>
      </Route>
    </div>
  );
}
