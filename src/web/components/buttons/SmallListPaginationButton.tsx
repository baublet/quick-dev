import React from "react";
import cx from "classnames";

export function SmallListPaginationButton(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button
      {...props}
      className={cx(
        `p-2 bg-gray-300 rounded hover:bg-blue-300 text-xs uppercase font-bold`,
        props.className
      )}
    />
  );
}
