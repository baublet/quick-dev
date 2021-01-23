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
  const [loading, setLoading] = React.useState(false);
  const [deleteMutation] = useDeleteEnvironmentMutation({
    onCompleted: () => {
      history.push("/environments");
      setLoading(false);
    },
  });

  const deleteEnvironment = () => {
    setLoading(true);
    deleteMutation({
      variables: {
        id: environment?.id || "",
      },
    });
  };

  return (
    <DestructiveActionButton
      full={true}
      onClick={deleteEnvironment}
      loading={loading}
    >
      Delete
    </DestructiveActionButton>
  );
}
