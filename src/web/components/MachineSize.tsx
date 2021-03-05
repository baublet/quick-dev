import React from "react";

import type { EnvironmentSize } from "../../lambda/common/entities/environment";

import { MachineSizeSmall } from "./svg/MachineSizeSmall";
import { MachineSizeMedium } from "./svg/MachineSizeMedium";
import { MachineSizeLarge } from "./svg/MachineSizeLarge";
import { MachineSizeExtraLarge } from "./svg/MachineSizeExtraLarge";
import { MachineSizeExtraExtraLarge } from "./svg/MachineSizeExtraExtraLarge";

export function MachineSize({ size }: { size: EnvironmentSize }) {
  switch (size) {
    case "s":
      return <MachineSizeSmall />;
    case "m":
      return <MachineSizeMedium />;
    case "l":
      return <MachineSizeLarge />;
    case "xl":
      return <MachineSizeExtraLarge />;
    case "xxl":
      return <MachineSizeExtraExtraLarge />;
    default:
      return null;
  }
}
