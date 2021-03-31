import React from "react";
import cx from "classnames";

const statusColorClasses = {
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-400",
  none: "bg-gray-400",
};

export function StatusIndicator({
  status = "none",
  alt,
}: {
  alt: string;
  status?: "red" | "yellow" | "green" | "none";
}) {
  return (
    <div
      className={cx(
        "align-middle inline-block w-3 h-3",
        statusColorClasses[status]
      )}
      title={alt}
    />
  );
}
