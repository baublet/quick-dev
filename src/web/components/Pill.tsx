import React from "react";
import cx from "classnames";

const baseClasses =
  "inline-block bg-gray-100 border border-gray-200 text-gray-600 uppercase py-1 px-2 text-xs font-bold rounded";

const classNames = {
  inert: baseClasses,
  danger: cx(baseClasses, "text-red-600 bg-red-100 border-red-200"),
  warning: cx(baseClasses, "text-yellow-700 bg-yellow-100 border-yellow-200"),
  success: cx(baseClasses, "text-green-600 bg-green-100 border-green-200"),
};

export function Pill({
  variant = "inert",
  working = false,
  children,
}: React.PropsWithChildren<{
  variant?: "inert" | "danger" | "warning" | "success";
  working?: boolean;
}>) {
  return (
    <div className={cx(classNames[variant], { "animate-pulse": working })}>
      {children}
    </div>
  );
}
