import React from "react";
import { GraphQLProvider } from "../GraphQLProvider";

import { Login } from "../Login";
import { AuthProvider } from "../useAuth";

import { UserDataTest } from "../UserDataTest";

export function Application() {
  return (
    <AuthProvider>
      <GraphQLProvider>
        <h1>QuickStrap</h1>
        <Login />
        <UserDataTest />
      </GraphQLProvider>
    </AuthProvider>
  );
}
