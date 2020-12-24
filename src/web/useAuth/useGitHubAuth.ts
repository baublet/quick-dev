import React from "react";

import { AuthData } from "./authContext";

export function useGitHubAuth(
  authData: AuthData,
  setAuthData: (data: AuthData) => void
) {
  const { githubState } = authData;

  React.useEffect(() => {
    // After requesting Github access, Github redirects back to your app with a code parameter
    const url = window.location.href;
    const hasCode = url.includes("/auth/github") && url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode && !authData.loading) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      setAuthData({ ...authData, loading: true });

      const requestData = {
        client_id: githubState.clientId,
        redirect_uri: githubState.redirectUri,
        client_secret: githubState.clientSecret,
        code: newUrl[1],
      };

      const proxyUrl = githubState.proxyUrl;

      // Use code parameter and other parameters to make POST request to proxy_server
      fetch(proxyUrl, {
        method: "POST",
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then(
          (data: { accessToken: string; tokenType: string; scope: string }) =>
            setAuthData({
              ...authData,
              authenticated: true,
              loading: false,
              githubState: {
                ...authData.githubState,
                accessToken: data.accessToken,
                tokenType: data.tokenType,
                scope: data.scope,
              },
            })
        )
        .catch((error) => {
          console.error({ error });
          setAuthData({ ...authData, loading: false });
        });
    }
  }, [authData, setAuthData]);
}
