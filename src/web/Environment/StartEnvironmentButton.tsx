import React from "react";
import { useHistory } from "react-router-dom";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { PrimaryActionButton } from "../components/buttons/PrimaryActionButton";
import { useStartEnvironmentMutation } from "../generated";

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function StartEnvironmentButton({
  environment,
}: EnvironmentActionsProps) {
  const [loading, setLoading] = React.useState(false);
  const [stopMutation] = useStartEnvironmentMutation({
    onCompleted: () => {
      setLoading(false);
    },
  });

  const startEnvironment = () => {
    setLoading(true);
    stopMutation({
      variables: {
        id: environment?.id || "",
      },
    });
  };

  return (
    <PrimaryActionButton
      full={true}
      onClick={startEnvironment}
      loading={loading}
    >
      Start
    </PrimaryActionButton>
  );
}
