import React from "react";
import { Route, Switch } from "react-router-dom";

import { NewEnvironment } from "../NewEnvironment";

export function Routes() {
  return (
    <Switch>
      <Route path="/environments/new" component={NewEnvironment}></Route>
    </Switch>
  );
}
