import React from "react";
import cx from "classnames";

import { ButtonSpinner } from "./ButtonSpinner";

export function SubmitButton({
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
        "border px-6 py-4 rounded text-l font-bold relative",
        {
          "border-blue-500 bg-blue-500 text-white hover:bg-blue-700": !loading,
          "w-full": Boolean(full),
          "bg-transparent border-blue-500 text-blue-500 pointer-events-none": loading,
        },
        props.className
      )}
    >
      {loading && <ButtonSpinner />}
      <span className={cx({ "opacity-0": loading })}>{children}</span>
    </button>
  );
}
