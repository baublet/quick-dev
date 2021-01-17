import React from "react";

import { EnvironmentDetails } from "./useEnvironmentDetails";
import { DeleteEnvironmentButton } from "./DeleteEnvironmentButton";

interface EnvironmentActionsProps {
  environment: EnvironmentDetails["environment"];
}

export function EnvironmentActions({ environment }: EnvironmentActionsProps) {
  const buttons: {
    element: JSX.Element;
    show: boolean;
  }[] = [
    {
      element: <DeleteEnvironmentButton environment={environment} />,
      show: Boolean(environment?.permissions?.canDelete),
    },
  ];

  return (
    <>
      {buttons.map((button, index) =>
        !button.show ? (
          <React.Fragment key={index}></React.Fragment>
        ) : (
          <React.Fragment key={index}>{button.element}</React.Fragment>
        )
      )}
    </>
  );
}
