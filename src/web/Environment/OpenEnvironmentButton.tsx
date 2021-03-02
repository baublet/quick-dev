import React from "react";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { PrimaryActionButton } from "../components/buttons/PrimaryActionButton";
import { Computer } from "../components/svg/Computer";

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function OpenEnvironmentButton({
  environment,
}: EnvironmentActionsProps) {
  if (!environment) {
    return null;
  }

  return (
    <div className="relative">
      <PrimaryActionButton full={true} href={environment.url} loading={false}>
        <div className="flex">
          <Computer className="transform scale-75 opacity-75" />
          <div className="ml-4">Open</div>
        </div>
      </PrimaryActionButton>
      <span className="absolute flex h-3 w-3 right-3 top-1/2 transform -translate-y-1/2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300"></span>
      </span>
    </div>
  );
}
