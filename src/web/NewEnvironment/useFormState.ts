import React from "react";

import type { Repository } from "../../server/graphql/generated";
import type { EnvironmentSize } from "../../server/common/entities";

export function useFormState() {
  const [repository, setRepository] = React.useState<Repository>();
  const [environmentSize, setEnvironmentSize] = React.useState<EnvironmentSize>(
    "s"
  );
  const [size, setSize] = React.useState<EnvironmentSize>("s");

  return {
    environmentSize,
    setEnvironmentSize,
    repository,
    setRepository,
    size,
    setSize,
  };
}

export type FormState = ReturnType<typeof useFormState>;
