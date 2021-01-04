import React from "react";

import { useCurrentUserQuery } from "../generated";
import { useAuth } from "../useAuth";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export function useCurrentUser() {
  const { loading, data } = useCurrentUserQuery();
  const {
    setUserData,
    setAuthenticated,
    setLoading,
    authenticated,
  } = useAuth();

  React.useEffect(() => {
    setLoading(loading);
  }, [loading]);

  React.useEffect(() => {
    if (data?.user) {
      setAuthenticated(true);
      setUserData(data.user);
    }
  }, [data?.user]);

  if (loading) {
    return { loading: true, authenticated: false };
  }

  return {
    loading: false,
    user: data?.user,
    authenticated,
  };
}
