import React from "react";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { DeleteEnvironmentButton } from "./DeleteEnvironmentButton";
import { OpenEnvironmentButton } from "./OpenEnvironmentButton";
import { StopEnvironmentButton } from "./StopEnvironmentButton";

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function EnvironmentActions({ environment }: EnvironmentActionsProps) {
  const buttons: {
    element: JSX.Element;
    show: boolean;
  }[] = [
    {
      element: <OpenEnvironmentButton environment={environment} />,
      show: Boolean(environment?.permissions?.canOpen),
    },
    {
      element: <StopEnvironmentButton environment={environment} />,
      show: Boolean(environment?.permissions.canStop),
    },
    {
      element: <DeleteEnvironmentButton environment={environment} />,
      show: Boolean(environment?.permissions?.canDelete),
    },
  ];

  return (
    <div className="space-y-4">
      {buttons.map((button, index) =>
        !button.show ? (
          <React.Fragment key={index}></React.Fragment>
        ) : (
          <React.Fragment key={index}>{button.element}</React.Fragment>
        )
      )}
    </div>
  );
}
