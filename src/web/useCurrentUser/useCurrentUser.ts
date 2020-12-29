import React from "react";
import { useQuery, gql } from "@apollo/client";

import { useAuth } from "../useAuth";

const userQuery = gql`
  {
    user {
      id
      name
      email
    }
  }
`;

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export function useCurrentUser(): {
  loading: boolean;
  user?: CurrentUser;
  authenticated: boolean;
} {
  const { loading, data } = useQuery<{ user: CurrentUser }>(userQuery);
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
