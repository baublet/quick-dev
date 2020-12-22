import React from "react";

const placeholderFunction: any = () => {
  throw new Error(`useAuth not yet initialized`);
};

export interface AuthData {
  authenticated: boolean;
  loading: boolean;
  githubState: null | {
    clientId: string;
    redirectUri: string;
    clientSecret: string;
    code?: string;
    proxyUrl: string;
  };
  user: null | {
    name: string;
    email: string;
  };
}

const authContext = React.createContext<{
  authData: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
}>({
  authData: {
    authenticated: false,
    user: null,
    loading: false,
    githubState: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectUri: process.env.GITHUB_CLIENT_REDIRECT_URI,
      proxyUrl: process.env.GITHUB_CLIENT_PROXY_URL,
    },
  },
  setAuthData: placeholderFunction,
});

export const AuthProvider = authContext.Provider;
export const AuthContext = authContext;
