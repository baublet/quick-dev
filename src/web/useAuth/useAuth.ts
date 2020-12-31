import React from "react";

import { AuthContext, AuthData } from "./authContext";
import { useGitHubAuth } from "./useGitHubAuth";

export function useAuth() {
  const value = React.useContext(AuthContext);

  const authData = value.authData;
  const setAuthData = value.setAuthData;
  const scopes = process.env.GITHUB_CLIENT_SCOPE;
  const gitHubLink = `https://github.com/login/oauth/authorize?scope=${scopes}&client_id=${authData.githubState.clientId}&redirect_uri=${authData.githubState.redirectUri}`;

  useGitHubAuth(authData, setAuthData);

  return {
    authData,
    authenticated: authData.authenticated,
    loading: authData.loading,
    gitHubLink,
    setAuthenticated: (authenticated: boolean) =>
      setAuthData((authData) => ({ ...authData, authenticated })),
    setUserData: (user: AuthData["user"]) =>
      setAuthData((authData) => ({ ...authData, user })),
    setLoading: (loading: boolean) =>
      setAuthData((authData) => ({ ...authData, loading })),
  };
}
