import React from "react";
import { Route, Link, useLocation } from "react-router-dom";
import cx from "classnames";
import { useInView } from "react-hook-inview";

import type { EnvironmentCommand } from "../../../../server/common/entities";
import { LogOutput } from "../../../components/LogOutput";
import { StatusIndicator } from "../../../components/StatusIndicator";
import { useGetEnvironmentCommandLogsLazyQuery } from "../../../generated";
import { MoreButton } from "./MoreButton";
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
  const [hasMoreHead, setHasMoreHead] = React.useState<boolean>();
  const [hasMoreTail, setHasMoreTail] = React.useState<boolean>();

  const [
    tail,
    { loading: tailLoading },
  ] = useGetEnvironmentCommandLogsLazyQuery({
    fetchPolicy: "network-only",
    onError: (error) => console.error(error),
    onCompleted: (data) => {
      const results = data?.environmentCommandLogs?.edges || [];
      if (results.length === 0) {
        if (status === "success" || status === "failed") {
          setHasMoreTail(false);
        }
        return;
      }
      setLogData(
        (data) => data + results.map((result) => result.node.logOutput).join("")
      );
      setLastCursor(results[results.length - 1].cursor);
      if (!firstCursor) {
        setFirstCursor(results[0].cursor);
      }
      if (hasMoreHead === undefined) {
        setHasMoreHead(
          Boolean(data.environmentCommandLogs?.pageInfo.hasPreviousPage)
        );
      }
      if (status === "failed" || status === "success") {
        console.log(
          "setting failski --hasnextpage ",
          Boolean(data.environmentCommandLogs?.pageInfo.hasNextPage)
        );
        setHasMoreTail(
          Boolean(data.environmentCommandLogs?.pageInfo.hasNextPage)
        );
      } else if (status === "running") {
        setHasMoreTail(true);
      }
    },
  });

  const [
    head,
    { loading: headLoading },
  ] = useGetEnvironmentCommandLogsLazyQuery({
    fetchPolicy: "network-only",
    onError: (error) => console.error(error),
    onCompleted: (data) => {
      console.log({ data });
      const results = data?.environmentCommandLogs?.edges || [];
      if (results.length === 0) {
        if (status === "success" || status === "failed") {
          setHasMoreHead(false);
        }
        return;
      }
      setLogData(
        (data) => results.map((result) => result.node.logOutput).join("") + data
      );
      setFirstCursor(results[0].cursor);
      setHasMoreHead(
        Boolean(data.environmentCommandLogs?.pageInfo.hasPreviousPage)
      );
    },
  });

  // By default, load the last 100 lines
  React.useEffect(() => {
    tail({
      variables: {
        last: 100,
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
          <LogOutput
            logText={logData}
            header={
              <MoreButton
                type="head"
                disabled={!hasMoreHead}
                onClick={() => {
                  console.log("wut");
                  head({
                    variables: {
                      last: 500,
                      before: firstCursor,
                      commandId,
                    },
                  });
                }}
              >
                More
              </MoreButton>
            }
            footer={
              <>
                <div ref={tailRef} />{" "}
                <MoreButton
                  type="tail"
                  disabled={!hasMoreTail}
                  onClick={() => {
                    console.log("tailin");
                    tail({
                      variables: {
                        first: 500,
                        after: lastCursor,
                        commandId,
                      },
                    });
                  }}
                >
                  More
                </MoreButton>
              </>
            }
          />
        </div>
      </Route>
    </div>
  );
}
