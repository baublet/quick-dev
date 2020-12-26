import React from "react";
import { Link } from "react-router-dom"

import { Login } from "../Login";

export function Header() {
  return (
    <div>
      <h1>QuickStrap</h1>
      <hr />
      <Link to="/environments/new">Create Environment</Link>
      <hr />
      <Login />
    </div>
  );
}
