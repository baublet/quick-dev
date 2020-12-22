import React from "react";

import { AuthContext, AuthData } from "./authContext";

export function useAuth() {
  const value = React.useContext(AuthContext);

  return {
    setAuthenticated: (authenticated: boolean) =>
      value.setAuthData({ ...value.authData, authenticated }),
    setUserData: (user: AuthData["user"]) =>
      value.setAuthData({ ...value.authData, user }),
  };
}
