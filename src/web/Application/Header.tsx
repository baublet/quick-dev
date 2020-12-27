import React from "react";

import { Link } from "../components/Link";
import { Login } from "../Login";
import { H1 } from "../components/H1";
import { Divider } from "../components/Divider";

export function Header() {
  return (
    <div className="mt-10">
      <H1>StrapYard</H1>
      <Divider />
      <div className="space-x-1.5">
        <Link to="/environments">Environments</Link>
        <Link to="/environments/new">Create Environment</Link>
      </div>
      <Divider />
      <Login />
    </div>
  );
}
