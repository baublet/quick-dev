import React from "react";

import { Login } from "../Login";
import { AuthProvider } from "../useAuth";

export function Application() {
  return (
    <AuthProvider>
      <h1>QuickStrap</h1>
      <Login />
    </AuthProvider>
  );
}
