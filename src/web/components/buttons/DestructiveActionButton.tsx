import React from "react";
import cx from "classnames";

export function DestructiveActionButton({
  full,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  full?: boolean;
}) {
  return (
    <button
      {...props}
      className={cx(
        `p-2 bg-red-500 text-white rounded hover:bg-red-700 text-s font-bold`,
        {
          "w-full": Boolean(full),
        },
        props.className
      )}
    />
  );
}
