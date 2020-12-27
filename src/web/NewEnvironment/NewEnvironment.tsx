import React from "react";

import { useFormState } from "./useFormState";
import { RepositoryPicker } from "./RepositoryPicker";
import { H2 } from "../components/H2";
import { H3 } from "../components/H3";

export function NewEnvironment() {
  const formState = useFormState();
  return (
    <form>
      <H2>New Environment</H2>
      <H3>Repository</H3>
      {!formState.repository ? null : <>{formState.repository.name}</>}
      <RepositoryPicker formState={formState} />
    </form>
  );
}
