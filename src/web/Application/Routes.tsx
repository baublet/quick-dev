import React from "react";
import { Route, Switch } from "react-router-dom";

import { NewEnvironment } from "../NewEnvironment";
import { Environment } from "../Environments";
import { EnvironmentPage } from "../Environment";

export function Routes() {
  return (
    <Switch>
      <Route path="/environments/new" component={NewEnvironment} />
      <Route path="/environments" component={Environment} />
      <Route path="/environment/:environmentId" component={EnvironmentPage} />
    </Switch>
  );
}
