import React from "react";

import type { EnvironmentSize } from "../../server/common/entities/environment";

import { H4 } from "../components/H4";
import { Meatball } from "../components/Meatball";
import { Link } from "../components/Link";
import { Environment } from "../generated";
import { MachineSize } from "../components/MachineSize";
import { EnvironmentStatusBadge } from "../Environment/EnvironmentStatusBadge";

interface EnvironmentProps {
  environment: Pick<
    Environment,
    "id" | "name" | "size" | "lifecycleStatus" | "ipv4"
  >;
}

export function EnvironmentCard({ environment }: EnvironmentProps) {
  return (
    <div className="relative max-w-xs p-2 border rounded border-gray-300 hover:border-gray-500 flex">
      <div className="w-16 text-gray-500 mr-4">
        <MachineSize size={environment.size as EnvironmentSize} />
      </div>
      <div>
        <H4>
          <Link to={`/environment/${environment.id}`}>{environment.name}</Link>
        </H4>
        <div className="my-1">
          <EnvironmentStatusBadge status={environment.lifecycleStatus} />
        </div>
        {environment.ipv4 ? (
          <div>
            <b>IP:</b> {environment.ipv4}
          </div>
        ) : null}
        <div className="absolute top-0 right-0 mt-1 mr-1">
          <Meatball>Test</Meatball>
        </div>
      </div>
    </div>
  );
}
