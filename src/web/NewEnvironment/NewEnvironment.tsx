import React from "react";

import { useFormState } from "./useFormState";
import { RepositoryPicker } from "./RepositoryPicker";
import { H2 } from "../components/H2";
import { H3 } from "../components/H3";
import { Link } from "../components/svg/Link";
import { SizePicker } from "./SizePicker";
import { SubmitButton } from "../components/buttons/SubmitButton";
import { VSpace } from "../components/VSpace";

export function NewEnvironment() {
  const formState = useFormState();
  return (
    <form>
      <H2>New Environment</H2>
      {!formState.repository ? null : (
        <>
          <H3 className="mt-4">Selected Repository</H3>
          <a
            className="my-4 inline-block px-4 py-2 rounded border border-blue-500 text-blue-700 font-bold whitespace-nowrap"
            href={formState.repository.htmlUrl}
            target="_blank"
          >
            {formState.repository.name}&nbsp;
            <Link />
          </a>
        </>
      )}
      <RepositoryPicker formState={formState} />
      <SizePicker formState={formState} />
      <VSpace />
      <SubmitButton>Create Environment</SubmitButton>
    </form>
  );
}
