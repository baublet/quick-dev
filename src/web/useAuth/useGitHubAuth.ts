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
    const hasCode = url.includes("?code=");

    // If Github API returns the code parameter
    if (hasCode && !authData.loading) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      setAuthData({ ...authData, loading: true });

      const requestData = {
        client_id: authData.githubState.clientId,
        redirect_uri: authData.githubState.redirectUri,
        client_secret: authData.githubState.clientSecret,
        code: newUrl[1],
      };

      const proxyUrl = authData.githubState.proxyUrl;

      // Use code parameter and other parameters to make POST request to proxy_server
      fetch(proxyUrl, {
        method: "POST",
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
        })
        .catch((error) => {
          console.error({ error });
        })
        .finally(() => {
          setAuthData({ ...authData, loading: false });
        });
    }
  }, [authData, setAuthData]);
}
