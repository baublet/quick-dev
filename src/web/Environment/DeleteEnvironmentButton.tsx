import React from "react";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { DestructiveActionButton } from "../components/buttons/DestructiveActionButton";
import { useDeleteEnvironmentMutation } from "../generated"

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function DeleteEnvironmentButton({ environment }: EnvironmentActionsProps) {
  const [deleteMutation] = useDeleteEnvironmentMutation();

  const deleteEnvironment = () =>
    deleteMutation({
      variables: {
        id: environment.id,
      },
    });

  return (
    <DestructiveActionButton full={true} onClick={deleteEnvironment}>
      Delete
    </DestructiveActionButton>
  );
}
