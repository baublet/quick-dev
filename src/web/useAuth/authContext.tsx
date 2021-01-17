import React from "react";

const placeholderFunction: any = () => {
  throw new Error(`useAuth not yet initialized`);
};

export interface AuthData {
  authenticated: boolean;
  loading: boolean;
  githubState: null | {
    clientId: string;
    clientSecret: string;
    code?: string;
    proxyUrl: string;
    redirectUri: string;
  };
  user: null | {
    name: string;
    email: string;
  };
}

const getDefaultAuthData = (): AuthData => ({
  authenticated: false,
  user: null,
  loading: false,
  githubState: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    proxyUrl: process.env.GITHUB_CLIENT_PROXY_URL || "",
    redirectUri: process.env.GITHUB_CLIENT_REDIRECT_URI || "",
  },
});

const authContext = React.createContext<{
  authData: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
}>({
  authData: getDefaultAuthData(),
  setAuthData: placeholderFunction,
});

export const AuthProvider = (props: React.PropsWithChildren<{}>) => {
  const [authData, setAuthData] = React.useState<AuthData>(
    getDefaultAuthData()
  );

  return (
    <authContext.Provider value={{ authData, setAuthData }}>
      {props.children}
    </authContext.Provider>
  );
};
export const AuthContext = authContext;
