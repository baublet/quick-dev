import React from "react";

import { useAuth } from "../useAuth";
import { useCurrentUser } from "../useCurrentUser";

export function Login() {
  const { gitHubLink } = useAuth();
  const { loading, authenticated } = useCurrentUser();

  if (authenticated || loading) {
    return null;
  }
  return (
    <div>
      <h2>Login</h2>
      <ul>
        <li>
          <a href={gitHubLink}>Sign in with GitHub</a>
        </li>
      </ul>
    </div>
  );
}
