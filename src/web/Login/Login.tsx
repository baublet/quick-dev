import React from "react";

import { useAuth } from "../useAuth";

export function Login() {
  const { gitHubLink, loading, authenticated } = useAuth();
  if (authenticated) {
    return null;
  }
  if (loading) {
    return <b>Loading...</b>;
  }
  return (
    <>
      <h2>Login</h2>
      <ul>
        <li>
          <a href={gitHubLink}>Sign in with GitHub</a>
        </li>
      </ul>
    </>
  );
}
