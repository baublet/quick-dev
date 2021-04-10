import React from "react";
import cx from "classnames";

import { ButtonSpinner } from "./ButtonSpinner";

export function PrimaryActionButton({
  full,
  loading,
  children,
  variant = "normal",
  disabled = false,
  newWindow,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  full?: boolean;
  loading?: boolean;
  disabled?: boolean;
  variant?: "inverted" | "normal";
  href?: string;
  newWindow?: boolean;
}) {
  const Component = "href" in props ? "a" : "button";

  if (newWindow && "href" in props) {
    (props as any).target = "_blank";
  }

  return (
    <Component
      {...(props as any)}
      className={cx(
        "p-2 rounded border text-s font-bold relative block",
        {
          "border-blue-500 bg-blue-500 text-white hover:bg-blue-700":
            variant === "normal",
          "w-full": Boolean(full),
          "bg-transparent border-blue-500 text-blue-500 hover:bg-blue-50":
            variant === "inverted",
          "pointer-events-none": loading || disabled,
        },
        props.className
      )}
    >
      {loading && <ButtonSpinner />}
      <span className={cx({ "opacity-0": loading })}>{children}</span>
    </Component>
  );
}
