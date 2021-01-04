import React from "react";
import { useHistory } from "react-router-dom";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { DestructiveActionButton } from "../components/buttons/DestructiveActionButton";
import { useDeleteEnvironmentMutation } from "../generated";

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function DeleteEnvironmentButton({
  environment,
}: EnvironmentActionsProps) {
  const history = useHistory();
  const [deleteMutation] = useDeleteEnvironmentMutation({
    onCompleted: () => history.push("/environments"),
  });

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
