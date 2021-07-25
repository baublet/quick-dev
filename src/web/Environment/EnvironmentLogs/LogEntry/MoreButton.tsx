import React from "react";
import cx from "classnames";

export function MoreButton({
  onClick,
  type,
  disabled,
  children,
}: React.PropsWithChildren<{
  type: "head" | "tail";
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}>) {
  return (
    <>
      <button
        onClick={onClick}
        className={cx(
          "p-2 rounded border border-white block text-center w-full hover:bg-gray-700",
          {
            "mb-4": type === "head",
            "mt-4": type === "tail",
            "border-gray-600 text-gray-600 pointer-events-none": disabled,
          }
        )}
      >
        {children} {disabled ? "disabled" : ""}
      </button>
    </>
  );
}
