import React from "react";

import { Link } from "../components/Link";
import { H1 } from "../components/H1";
import { Divider } from "../components/Divider";
import { UserProfilePanel } from "../UserProfilePanel";
import { useCurrentUser } from "../useCurrentUser";

export function Header() {
  const { authenticated } = useCurrentUser();

  return (
    <div className="mt-10">
      <div className="flex">
        <div className="flex-grow">
          <H1>StrapYard</H1>
        </div>
        <div>
          <UserProfilePanel />
        </div>
      </div>
      <Divider />
      <div className="space-x-1.5">
        <Link to="/environments">Environments</Link>
        {authenticated && (
          <Link to="/environments/new">Create Environment</Link>
        )}
      </div>
      <Divider />
    </div>
  );
}
