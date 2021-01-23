import React from "react";
import cx from "classnames";

import { ButtonSpinner } from "./ButtonSpinner";

export function DestructiveActionButton({
  full,
  loading,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  full?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      className={cx(
        "p-2 rounded border text-s font-bold relative",
        {
          "border-red-500 bg-red-500 text-white hover:bg-red-700": !loading,
          "w-full": Boolean(full),
          "bg-transparent border-red-500 text-red-500 pointer-events-none": loading,
        },
        props.className
      )}
    >
      {loading && <ButtonSpinner />}
      <span className={cx({ "opacity-0": loading })}>{children}</span>
    </button>
  );
}
