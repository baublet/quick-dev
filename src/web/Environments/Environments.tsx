import React from "react";

import { useCurrentUserEnvironments } from "../useCurrentUserEnvironments";
import { H3 } from "../components/H3";
import { Loader } from "../components/Loader";
import { EnvironmentCard } from "../EnvironmentCard";

export function Environment() {
  const { loading, environments } = useCurrentUserEnvironments();

  return (
    <>
      <H3>Environments</H3>
      <Loader display={loading} />
      <ul>
        {environments
          .filter((env) => !env.deleted)
          .map((env) => (
            <EnvironmentCard key={env.id} environment={env} />
          ))}
      </ul>
    </>
  );
}
