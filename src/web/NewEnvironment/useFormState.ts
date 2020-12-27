import React from "react";

import type { Repository } from "../../lambda/common/repository";
import type { EnvironmentSize } from "../../lambda/common/environment";

export function useFormState() {
  const [repository, setRepository] = React.useState<Repository>(null);
  const [environmentSize, setEnvironmentSize] = React.useState<EnvironmentSize>(
    "s"
  );

  return {
    environmentSize,
    setEnvironmentSize,
    repository,
    setRepository,
  };
}

export type FormState = ReturnType<typeof useFormState>;
