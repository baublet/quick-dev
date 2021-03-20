import React from "react";
import { useHistory } from "react-router-dom";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { DestructiveActionButton } from "../components/buttons/DestructiveActionButton";
import { useStopEnvironmentMutation } from "../generated";

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function StopEnvironmentButton({
  environment,
}: EnvironmentActionsProps) {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [stopMutation] = useStopEnvironmentMutation({
    onCompleted: () => {
      setLoading(false);
    },
  });

  const stopEnvironment = () => {
    setLoading(true);
    stopMutation({
      variables: {
        id: environment?.id || "",
      },
    });
  };

  return (
    <DestructiveActionButton
      full={true}
      onClick={stopEnvironment}
      loading={loading}
    >
      Stop
    </DestructiveActionButton>
  );
}
