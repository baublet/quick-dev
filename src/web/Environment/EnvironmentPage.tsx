import React from "react";
import { useParams } from "react-router-dom";

import { Environment } from "./Environment";

export function EnvironmentPage() {
  const { environmentId } = useParams<{ environmentId: string }>();

  if (!environmentId) {
    return <b>404</b>;
  }

  return <Environment id={environmentId} />;
}
