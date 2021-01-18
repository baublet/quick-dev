import React from "react";
import cx from "classnames";

export function VSpace({
  size = "m",
  collapse = false,
}: {
  size?: "m";
  collapse?: boolean;
}) {
  return (
    <div
      className={cx("w-0", {
        "inline-block": collapse,
        block: !collapse,
        "h-8": size === "m",
      })}
    />
  );
}
