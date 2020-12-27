import React from "react";
import { Route, Switch } from "react-router-dom";

import { NewEnvironment } from "../NewEnvironment";
import { Environment } from "../Environments";

export function Routes() {
  return (
    <Switch>
      <Route path="/environments/new" component={NewEnvironment} />
      <Route path="/environments" component={Environment} />
    </Switch>
  );
}
