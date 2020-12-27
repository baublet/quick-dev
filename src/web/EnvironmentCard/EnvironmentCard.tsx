import React from "react";

import type { Environment } from "../../lambda/common/environment";
import { H4 } from "../components/H4";
import { Meatball } from "../components/Meatball";

interface EnvironmentProps {
  environment: Pick<Environment, "id" | "name" | "size" | "lifecycleStatus">;
}

export function EnvironmentCard({ environment }: EnvironmentProps) {
  return (
    <div className="relative max-w-xs p-2 border rounded border-gray-300 hover:border-gray-500">
      <H4>{environment.name}</H4>
      <b>Status:</b> {environment.lifecycleStatus}
      <div className="absolute top-0 right-0 mt-1 mr-1">
        <Meatball>Test</Meatball>
      </div>
    </div>
  );
}
