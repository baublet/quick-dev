import React from "react";
import { Route, Switch } from "react-router-dom";

import { LogOutput } from "../../components/LogOutput";

interface EnvironmentLogsRoutesProps {
  environmentId: string;
  startupLogs: string;
}

export function EnvironmentLogsRoutes(props: EnvironmentLogsRoutesProps) {
  const defaultRoute = <LogOutput logText={props.startupLogs} />;
  return (
    <Switch>
      <Route path={`/environment/${props.environmentId}/logs`} key="default">
        {defaultRoute}
      </Route>
      <Route
        path={`/environment/${props.environmentId}/logs/startup`}
        key="startup"
      >
        {defaultRoute}
      </Route>
    </Switch>
  );
}
