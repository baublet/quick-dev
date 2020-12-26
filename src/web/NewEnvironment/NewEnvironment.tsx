import React from "react";

import { RepositoryPicker } from "./RepositoryPicker";

export function NewEnvironment() {
  return (
    <form>
      <h2>New Environment</h2>
      <h3>Repository</h3>
      <RepositoryPicker />
    </form>
  );
}
