import React from "react";

import type { Environment } from "../../lambda/common/environment";
import { H4 } from "../components/H4";

interface EnvironmentProps {
  environment: Pick<Environment, "id" | "name" | "size">;
}

export function EnvironmentCard({ environment }: EnvironmentProps) {
  return (
    <div className="max-w-xs p-2 border rounded border-gray-300 hover:border-gray-500">
      <H4>{environment.name}</H4>
    </div>
  );
}
