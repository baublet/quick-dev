import React from "react";

import { useAuth } from "../useAuth";
import { useCurrentUser } from "../useCurrentUser";
import { Link } from "../components/Link";

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
          <Link to={gitHubLink}>Sign in with GitHub</Link>
        </li>
      </ul>
    </div>
  );
}
